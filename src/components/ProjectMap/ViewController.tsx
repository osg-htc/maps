'use client'

import { Box, Button, Divider, Typography } from '@mui/material';
import { useEffect, useMemo, useReducer } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import { ProjectData } from '@/src/utils/adstash';
import Sidebar from '../Sidebar';
import SidebarStack from '../SidebarStack';
import ProjectPins, { ProjectPinProps } from "./ProjectPins"
import InsitutionPins from "./InsitutionPins"
import ProjectStats from "./ProjectStats"
import ProjectListCard from './ProjectListCard';
import InsitutionListCard from './InstitutionListCard';

enum MapSteps {
  SelectingInstitution,
  SelectingProject,
  ViewingProject,
}

type MapStates =
  | { step: MapSteps.SelectingInstitution, institution: "", project: "" }
  | { step: MapSteps.SelectingProject, institution: string, project: "" }
  | { step: MapSteps.ViewingProject, institution: string, project: string }

type MapActions =
  | { type: "institution-select", institution: string }
  | { type: "institution-deselect" }
  | { type: "project-select", project: string }
  | { type: "project-deselect" }

const initialState: MapStates = {
  step: MapSteps.SelectingInstitution, 
  institution: "",
  project: ""
}

function reducer(state: MapStates, action: MapActions): MapStates {
  console.log(state, action);
  switch (action.type) {
    case "institution-select": {
      return { ...state, step: MapSteps.SelectingProject, institution: action.institution, project: "" };
    }
    case "institution-deselect":{
      return { ...state, step: MapSteps.SelectingInstitution, institution: "", project: "" };
    }
    case "project-select":{
      return { ...state, step: MapSteps.ViewingProject, project: action.project };
    }
    case "project-deselect":{
      return { ...state, step: MapSteps.SelectingProject, project: "" };
    }
  }
}

export default function ViewController({ rawProjectsData }: {rawProjectsData: Record<string, Partial<ProjectData>>  }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { current: map } = useMap();

  // remove all projects that are falsy in specific fields that we need
  const filteredProjectsData: Record<string, ProjectData> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(rawProjectsData ?? {}).filter(([_, p]) =>
        p.projectInstitutionName &&
        p.projectName &&
        p.projectInstitutionLatitude &&
        p.projectInstitutionLongitude
      )
    ) as Record<string, ProjectData>;
  }, [rawProjectsData])

  const projectBinsByInstitution: Record<string, ProjectData[]> = useMemo(() => {
    return Object.values(filteredProjectsData ?? {}).reduce<Record<string, ProjectData[]>>(
      (bins, project) => {
        bins[project.projectInstitutionName] ??= [];
        bins[project.projectInstitutionName].push(project as ProjectData);
        return bins;
      },
      {}
    );
  }, [filteredProjectsData]);


  const mapPinData: ProjectPinProps[] = useMemo(() => {
    return Object.values(projectBinsByInstitution).map((bin) => ({
      name: bin[0].projectInstitutionName,
      num: bin.length,
      lat: bin[0].projectInstitutionLatitude,
      lon: bin[0].projectInstitutionLongitude,
      onClick: () => { dispatch({ type: "institution-select", institution: bin[0].projectInstitutionName }) },
    }));
  }, [projectBinsByInstitution]);


  return (
    <>
      <ProjectPins pins={mapPinData} hidden={ state.step == MapSteps.ViewingProject } />

      { state.step != MapSteps.ViewingProject ? <></> : <InsitutionPins mainPin={filteredProjectsData[state.project]}/> }

      <Sidebar>
        {state.step == MapSteps.SelectingInstitution
          ? <>
            <Typography
              variant='subtitle1'
              lineHeight={1.1}
              align='center'
              sx={{
                m: 2,
              }}
            >
              Select an institution from the list or by cliking on the map
            </Typography>
            <Divider
              sx={{
                m: 2,
              }}
            /> 
          </>
          : <Button
          variant="outlined"
          onClick={() => { dispatch({ type: state.step == MapSteps.SelectingProject ? "institution-deselect" : "project-deselect" }) }}
          sx={{
            m: 1,
            borderRadius: 2,
            "&:hover": {
              boxShadow: 3,
            },
          }}
        >
          Back
        </Button> }
        <SidebarStack>
          {state.step == MapSteps.SelectingInstitution
            ? mapPinData.sort((a, b) => a.name.localeCompare(b.name)).map((pin) => {
              return <InsitutionListCard institution={ pin } />
            })
            : state.step == MapSteps.SelectingProject
            ? projectBinsByInstitution[state.institution].sort((a, b) => b.numJobs - a.numJobs).map((project: ProjectData) => {
              return <ProjectListCard key={ project.projectName } project={project} click={(p) => { dispatch({ type: "project-select", project: p }) }} />
            })
            : <ProjectStats stats={filteredProjectsData[state.project]} />
          }
        </SidebarStack>
      </Sidebar>
    </>
  )
}