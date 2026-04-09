'use client'

import { Button } from '@mui/material';
import { useState, useMemo, useReducer } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import useSWR from 'swr';
import { getProjects, ProjectData } from '@/src/utils/adstash';
import Sidebar from '../Sidebar';
import SidebarStack from '../SidebarStack';
import ProjectList from "./ProjectList";
import ProjectPins, { ProjectPinProps } from "./ProjectPins"
import InsitutionPins from "./InsitutionPins"
import ProjectStats from "./ProjectStats"

enum MapSteps {
  Loading,
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
  | { type: "data-loaded" }
  | { type: "institution-select", institution: string }
  | { type: "institution-deselect" }
  | { type: "project-select", project: string }
  | { type: "project-deselect" }

const initialState = {
  step: MapSteps.Loading, 
  institution: "",
  project: ""
}

function reducer(state: MapStates, action: MapActions) {
  console.log(state, action);
  switch (action.type) {
    case "data-loaded": {
      return { ...state, step: MapSteps.SelectingInstitution, institution: "", project: "" };
    }
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

export default function ProjectMapController() {
  const { current: map } = useMap();
  const { data: projectsData, isLoading: areProjectsLoading } = useSWR([getProjects], () => getProjects());
  const [selectedInstitutionName, setSelectedInstitution] = useState<string>("")
  const [selectedProjectName, setSelectedProject] = useState<string>("")
  const [state, dispatch] = useReducer(reducer, initialState);

  // remove all projects that are falsy in specific fields that we need
  const filteredProjectsData: Record<string, ProjectData> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(projectsData ?? {}).filter(([_, p]) =>
        p.projectInstitutionName &&
        p.projectName &&
        p.projectInstitutionLatitude &&
        p.projectInstitutionLongitude
      )
    ) as Record<string, ProjectData>;
  }, [projectsData])


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
  }, [projectBinsByInstitution, map]);



  switch (state.step) {
    case MapSteps.Loading: {
      return <></>
    }
    
      
    case MapSteps.SelectingInstitution: {
      return <>
        <ProjectPins pins={mapPinData} />
      </>
    }

      
    case MapSteps.SelectingProject: {
      return <>
        <Sidebar width={360}>
          <Button
            variant="outlined"
            onClick={() => { setSelectedInstitution("") }}
            sx={{
              m: 1
            }}
          >
            Close
          </Button>
          <SidebarStack>
            <ProjectList projects={ projectBinsByInstitution[selectedInstitutionName] } click={(x) => {
              setSelectedProject(x);
              map?.flyTo({
                zoom: 3,
                duration: 1500,
                essential: true,
              });
              }} />
          </SidebarStack>
        </Sidebar>
        <ProjectPins pins={mapPinData} />
      </>
    }

    case MapSteps.ViewingProject: {
      return <>
        <Sidebar width={360}>
          <Button
            variant="outlined"
            onClick={() => { setSelectedProject("") }}
            sx={{
              m: 1
            }}
          >
            Back
          </Button>
          <SidebarStack>
            <ProjectStats stats={filteredProjectsData[selectedProjectName]} />
          </SidebarStack>
        </Sidebar>
        <InsitutionPins mainPin={ filteredProjectsData[selectedProjectName] } />
      </>
    }
  }
}