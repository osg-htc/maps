'use client'

import { Typography, Stack, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import useSWR from 'swr';
import { getProjects } from '@/src/utils/adstash.mjs';
import Sidebar from '../Sidebar';
import ProjectList from "./ProjectList";
import ProjectMapPins, { ProjectMapPinsProps } from "./ProjectMapPins"


type MapStep = 'loading' | 'no-selection' | 'institution-selected' | 'project-selected'


function ProjectMapController() {
  const { current: map } = useMap();
  const [currentStep, setCurrentStep] = useState<MapStep>('loading')
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("")
  const [selectedProject, setSelectedProject] = useState<string>("")


  // MATT: getProjects is not defined in TS so we can't handle the types cleanly,
  //       we should either define the strcutre of this data here (bad) or convert
  //       adstash and the elastic search files to TS (hard), for now this is just
  //       a bunch of gymnastics to satisfy the type checker
  const { data, error, isLoading } = useSWR([getProjects], () => getProjects());


  console.log(data)


  const projectBinsByInstitution = Object.groupBy(
    Object.values(data ?? {}).filter((p: any) =>
      p?.projectInstitutionLatitude !== undefined &&
      p?.projectInstitutionLongitude !== undefined &&
      p?.projectInstitutionName
    ),
    (project: any) => project.projectInstitutionName
  );


  const mapPinData: ProjectMapPinsProps[] = Object.values(projectBinsByInstitution).map((bin) => {
    return {
      key: bin && bin[0].projectInstitutionName,
      num: (bin && bin.length.toString()) ?? "",
      lat: bin && bin[0].projectInstitutionLatitude,
      lon: bin && bin[0].projectInstitutionLongitude,
      onClick: () => {setSelectedInstitution(bin && bin[0].projectInstitutionName)},
    }
  });

  // move the map center over if the side bar is open
  map?.easeTo({
    padding: { left: leftPanelVisible ? 360 : 0, top: 0, right: 0, bottom: 0 },
    duration: 0,
  });


  






  if (selectedInstitution) {

  }

  return (
    <>
      <Sidebar width={leftPanelVisible ? 360 : 0}>
        <ProjectList />
      </Sidebar>
      <ProjectMapPins pins={mapPinData} />
    </>
  )
}

export default ProjectMapController;
