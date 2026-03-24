'use client'

import { Box, Grid, Paper } from '@mui/material';
import MapData from "@/src/components/ProjectMap/ProjectMapData";
import ProjectStatistics from "@/src/components/ProjectMap/ProjectMapStatistics";
import { ReactNode, useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';

function BaseSidebar({children}: {children: ReactNode}) {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const { current: map } = useMap();
  const PANEL_WIDTH = 360;


  map?.easeTo({
      padding: { left: PANEL_WIDTH, top: 0, right: 0, bottom: 0 },
      duration: 0,
  });

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
        { children }
      </Paper>
    </>
  )
}

export default BaseSidebar;
