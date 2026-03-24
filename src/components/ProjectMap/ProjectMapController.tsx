'use client'

import ProjectStatistics from "./ProjectMapStatistics";
import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import Sidebar from '../Sidebar';
import useSWR from 'swr';
import { getProjects } from '@/src/utils/adstash.mjs';

function ProjectMapController() {
  const { current: map } = useMap();

  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("")
  const [selectedProject, setSelectedProject] = useState<string>("")

  const { data, error, isLoading } = useSWR([getProjects], () => getProjects());
  const bins: Record<string, any[]> = {};


  useEffect(() => {
    map?.easeTo({
      padding: { left: leftPanelVisible ? 360 : 0, top: 0, right: 0, bottom: 0 },
      duration: 0,
    });
  }, [map, leftPanelVisible])


  useEffect(() => {
    if (data) {
      console.log(data)

      Object.values(data).forEach((project: any) => {
        if (project.projectInstitutionLatitude === undefined) return
        if (!bins[project.projectInstitutionName]) bins[project.projectInstitutionName] = []
        bins[project.projectInstitutionName].push(project)
      })
    }

    console.log(bins)
  }, [data])


  return (
    <>
      <Sidebar width={leftPanelVisible ? 360 : 0}>
        <ProjectStatistics />
      </Sidebar>
      {/* {pinData && <ProjectMapData pinBins={pinData} />} */}
    </>
  )
}

export default ProjectMapController;
