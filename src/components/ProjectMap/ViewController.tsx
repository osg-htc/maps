'use client'

import { Button } from '@mui/material';
import { useEffect, useMemo, useReducer } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import { ProjectData } from '@/src/utils/adstash';
import Sidebar from '../Sidebar';
import SidebarStack from '../SidebarStack';
import ProjectList from "./ProjectList";
import ProjectPins, { ProjectPinProps } from "./ProjectPins"
import InsitutionPins from "./InsitutionPins"
import ProjectStats from "./ProjectStats"

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
      num: bin.length.toString(),
      lat: bin[0].projectInstitutionLatitude,
      lon: bin[0].projectInstitutionLongitude,
      onClick: () => { dispatch({ type: "institution-select", institution: bin[0].projectInstitutionName }) },
    }));
  }, [projectBinsByInstitution]);


  return (
    <>
      <ProjectPins pins={mapPinData} hidden={ state.step == MapSteps.ViewingProject } />

      { state.step != MapSteps.ViewingProject ? <></> : <InsitutionPins mainPin={filteredProjectsData[state.project]}/> }

      { state.step == MapSteps.SelectingInstitution ? <></> :
        <Sidebar>
          <Button
            variant="outlined"
            onClick={() => { dispatch({ type: state.step == MapSteps.SelectingProject ? "institution-deselect" : "project-deselect" }) }}
            sx={{ m: 1 }}
          >
            {state.step == MapSteps.SelectingProject ? "Close" : "Back"}
          </Button>
          <SidebarStack>
            { state.step == MapSteps.SelectingProject
              ? <ProjectList
                  projects={projectBinsByInstitution[state.institution]}
                  click={(p) => { dispatch({ type: "project-select", project: p }) }}
                />
              : <ProjectStats stats={filteredProjectsData[state.project]} />
            }
          </SidebarStack>
        </Sidebar>
      }
    </>
  )
}