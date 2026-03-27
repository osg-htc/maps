'use client'

import { Typography, Stack, Paper } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import useSWR from 'swr';
import { getProjects, getInstitutionOverview } from '@/src/utils/adstash';
import Sidebar from '../Sidebar';
import ProjectList, { ProjectListItemProps } from "./ProjectList";
import ProjectMapPins, { ProjectMapPinProps } from "./ProjectMapPins"
import ProjectStats, { ProjectStatsProps } from "./ProjectStats"

type MapStep = 'loading' | 'no-selection' | 'institution-selected' | 'project-selected'

function ProjectMapController() {
   // MATT: getProjects is not defined in TS so we can't handle the types cleanly,
  //       we should either define the strcutre of this data here (bad) or convert
  //       adstash and the elastic search files to TS (hard), for now this is just
  //       a bunch of gymnastics to satisfy the type checker
  const { data, error, isLoading } = useSWR([getProjects], () => getProjects());
  const { current: map } = useMap();
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("")
  const [selectedProject, setSelectedProject] = useState<string>("")

  const projectBinsByInstitution = useMemo(() => {
    return Object.groupBy(
      Object.values(data ?? {}).filter((project: any) =>
        project?.projectInstitutionLatitude !== undefined &&
        project?.projectInstitutionLongitude !== undefined &&
        project?.projectInstitutionName
      ),
      (project: any) => project.projectInstitutionName
    )
  }, [data]);

  const mapPinData: ProjectMapPinProps[] = useMemo(() => {
    return Object.values(projectBinsByInstitution).map((bin) => ({
      name: bin?.[0].projectInstitutionName,
      num: bin?.length.toString() ?? "",
      lat: bin?.[0].projectInstitutionLatitude,
      lon: bin?.[0].projectInstitutionLongitude,
      onClick: () => setSelectedInstitution(bin?.[0].projectInstitutionName),
    }))
  }, [projectBinsByInstitution]);


  const selectedInstitutionProjects: ProjectListItemProps[] = useMemo(() => {
    return projectBinsByInstitution[selectedInstitution]?.map((project) => ({
      name: project.projectName,
      field: project.detailedFieldOfScience,
      institution: project.projectInstitutionName,
      onClick: () => { setSelectedProject(project.projectName) },
    })) ?? []
  }, [projectBinsByInstitution, selectedInstitution]);
  
  
  const selectedProjectStats: ProjectStatsProps = useMemo(() => {
    if (!data || !selectedProject) return {
        numJobs: 0,
        cpuHours: 0,
        gpuHours: 0,
        byteTransferCount: 0,
        fileTransferCount: 0,
        osdfByteTransferCount: 0,
        osdfFileTransferCount: 0,
    }
    const p: any = data[selectedProject]
    return {
        numJobs: p.numJobs,
        cpuHours: p.cpuHours,
        gpuHours: p.gpuHours,
        byteTransferCount: p.byteTransferCount,
        fileTransferCount: p.fileTransferCount,
        osdfByteTransferCount: p.osdfByteTransferCount,
        osdfFileTransferCount: p.osdfFileTransferCount,
    }
  }, [selectedProject]);


  useEffect(() => {
    if (!selectedInstitution || !map) return;

    const bin = projectBinsByInstitution[selectedInstitution];
    if (!bin) return;

    map.flyTo({
      center: [bin[0].projectInstitutionLongitude, bin[0].projectInstitutionLatitude],
      zoom: 12,
      duration: 2000,
      essential: true,
    });
  }, [selectedInstitution, selectedInstitutionProjects]);


  const currentStep: MapStep = (
    isLoading ? 'loading' :
    selectedProject ? 'project-selected' :
    selectedInstitution ? 'institution-selected' :
    'no-selection'
  )

  console.log('state: ' + currentStep)

  // move the map center over if the side bar is open
  useEffect(() => {
    map?.easeTo({
      padding: { left: currentStep == 'loading' || currentStep == 'no-selection' ? 0 : 360, top: 0, right: 0, bottom: 0 },
      duration: 0,
    })
  }, [currentStep]);

  switch (currentStep) {
    case 'loading':
      return <></>
    case 'no-selection':
      return <>
        <ProjectMapPins pins={mapPinData} />
      </>
    case 'institution-selected':
      return <>
        <Sidebar width={360}>
          <ProjectList projects={selectedInstitutionProjects} /> 
        </Sidebar>
        <ProjectMapPins pins={mapPinData} />
      </>
    case 'project-selected':
      return <>
        <Sidebar width={360}>
          <ProjectStats stats={ selectedProjectStats } /> 
        </Sidebar>
        <ProjectMapPins pins={mapPinData} />
      </>
  }
}

export default ProjectMapController;
