'use client'

import { Box, Grid, Paper } from '@mui/material';
import MapData from "@/src/components/ProjectMap/ProjectMapData";
import ProjectStatistics from "@/src/components/ProjectMap/ProjectMapStatistics";
import { useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import BaseSidebar from '../../BaseSidebar';

function ProjectMapController() {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const { current: map } = useMap();
  const PANEL_WIDTH = 360;


  map?.easeTo({
      padding: { left: PANEL_WIDTH, top: 0, right: 0, bottom: 0 },
      duration: 0,
  });


  const handlePinClick = () => {
    setLeftPanelVisible(!leftPanelVisible);
  }


  return (
    <>
      <BaseSidebar>
        <ProjectStatistics />
      </BaseSidebar>
      <MapData pinClickHandler={handlePinClick} />
    </>
  )
}

export default ProjectMapController;
