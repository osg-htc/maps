'use client'

import { Box, Grid, Paper } from '@mui/material';
import ProjectMapData from "./ProjectMapData";
import ProjectStatistics from "./ProjectMapStatistics";
import { useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import BaseSidebar from '../Sidebar';

function ProjectMapController() {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const { current: map } = useMap();


  map?.easeTo({
      padding: { left: leftPanelVisible ? 360 : 0, top: 0, right: 0, bottom: 0 },
      duration: 0,
  });


  return (
    <>
      <BaseSidebar width={leftPanelVisible ? 360 : 0}>
        <ProjectStatistics />
      </BaseSidebar>
      <ProjectMapData />
    </>
  )
}

export default ProjectMapController;
