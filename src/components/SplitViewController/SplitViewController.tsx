'use client'

import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Grid, Paper } from '@mui/material';
import MapData from "@/src/components/MapData";
import ProjectStatistics from "@/src/components/ProjectStatistics";
import { useRef, useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';

function SplitViewController() {
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
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          bottom: 8,
          width: PANEL_WIDTH - 16,
          zIndex: 1,
          borderRadius: 3,
          overflow: 'auto',
          m: 1,
        }}
      >
        <ProjectStatistics />
      </Paper>
      <MapData pinClickHandler={handlePinClick} />
    </>
  )
}

export default SplitViewController;
