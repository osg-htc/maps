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

type MapStates = {
  step: MapSteps,
  institution: string,
  project: string,
}

type MapActions =
  | { type: "institution-select", institution: string }
  | { type: "institution-deselect" }
  | { type: "project-select", project: string }
  | { type: "project-deselect" }

const initialState = {
  step: MapSteps.SelectingInstitution, 
  institution: "",
  project: ""
}

function reducer(state: MapStates, action: MapActions) {
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

export default function ViewController({ rawProjectsData }: {rawProjectsData: Record<string, Partial<ProjectData>> | undefined }) {
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






  switch (state.step) {
    case MapSteps.SelectingInstitution: {
      return <>
        <ProjectPins pins={mapPinData} />
      </>
    }

      
    case MapSteps.SelectingProject: {
      return <>
        <Sidebar>
          <Button
            variant="outlined"
            onClick={() => { dispatch({ type: "institution-deselect" }) }}
            sx={{
              m: 1
            }}
          >
            Close
          </Button>
          <SidebarStack>
            <ProjectList
              projects={projectBinsByInstitution[state.institution]}
              click={(p) => { dispatch({ type: "project-select", project: p }) }}
            />
          </SidebarStack>
        </Sidebar>
        <ProjectPins pins={mapPinData} />
      </>
    }

    case MapSteps.ViewingProject: {
      return <>
        <Sidebar>
          <Button
            variant="outlined"
            onClick={() => { dispatch({ type: "project-deselect" }) }}
            sx={{
              m: 1
            }}
          >
            Back
          </Button>
          <SidebarStack>
            <ProjectStats stats={filteredProjectsData[state.project]} />
          </SidebarStack>
        </Sidebar>
        <InsitutionPins mainPin={ filteredProjectsData[state.project] } />
      </>
    }
  }
}