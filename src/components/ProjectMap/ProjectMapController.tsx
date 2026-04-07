'use client'

import { Button } from '@mui/material';
import { useState, useMemo } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import useSWR from 'swr';
import { getProjects, ProjectData } from '@/src/utils/adstash';
import Sidebar from '../Sidebar';
import ProjectList from "./ProjectList";
import ProjectMapPins, { ProjectMapPinProps } from "./ProjectMapPins"
import ProjectMapContributorPins from "./ProjectMapContributorPins"
import ProjectStats from "./ProjectStats"

type MapStep = 'loading' | 'no-selection' | 'institution-selected' | 'project-selected'

function ProjectMapController() {
  const { data: projectsData, error: errorLoadingProjects, isLoading: areProjectsLoading } = useSWR([getProjects], () => getProjects());
  const { current: map } = useMap();
  const [selectedInstitution, setSelectedInstitution] = useState<string>("")
  const [selectedProjectName, setSelectedProject] = useState<string>("")
  
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



  const mapPinData: ProjectMapPinProps[] = useMemo(() => {
    return Object.values(projectBinsByInstitution).map((bin) => ({
      name: bin[0].projectInstitutionName,
      num: bin.length.toString(),
      lat: bin[0].projectInstitutionLatitude,
      lon: bin[0].projectInstitutionLongitude,
      onClick: () => {
        setSelectedInstitution(bin[0].projectInstitutionName) 
        setSelectedProject("") 
        map?.flyTo({
          center: [bin[0].projectInstitutionLongitude, bin[0].projectInstitutionLatitude],
          zoom: 12,
          duration: 2000,
          essential: true,
        });
      },
    }));
  }, [projectBinsByInstitution]);




  const currentStep: MapStep = (
    areProjectsLoading ? 'loading' :
    selectedProjectName ? 'project-selected' :
    selectedInstitution ? 'institution-selected' :
    'no-selection'
  )




  switch (currentStep) {
    case 'loading': {
      return <></>
    }
    
    case 'no-selection': {
      return <>
        <ProjectMapPins pins={mapPinData} />
      </>
    }

    case 'institution-selected': {
      return <>
        <Sidebar width={360}>
          <Button variant="contained" onClick={ () => { setSelectedInstitution("") } }>Close</Button>
          <ProjectList projects={ projectBinsByInstitution[selectedInstitution] } click={(x) => {
            setSelectedProject(x);
            map?.flyTo({
              zoom: 3,
              duration: 1500,
              essential: true,
            });
          }} />
        </Sidebar>
        <ProjectMapPins pins={mapPinData} />
      </>
    }

    case 'project-selected': {
      return <>
        <Sidebar width={360}>
          <Button variant="contained" onClick={ () => { setSelectedProject("") } }>Back</Button>
          <ProjectStats stats={ filteredProjectsData[selectedProjectName] } />
        </Sidebar>
        <ProjectMapContributorPins mainPin={ filteredProjectsData[selectedProjectName] } />
      </>
    }
  }
}

export default ProjectMapController;
