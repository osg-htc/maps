'use client'

import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Grid } from '@mui/material';
import Map from "@/src/components/Map";
import MapData from "@/src/components/MapData";
import Statistics from "@/src/components/Statistics";
import { useRef, useState } from 'react';


function SplitViewController() {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);

  const handlePinClick = () => {
    setLeftPanelVisible(!leftPanelVisible);
  }

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid size={leftPanelVisible ? 4 : 0}>
        <Box sx={{ height: "100%" }} >
          <Statistics></Statistics>
        </Box>
      </Grid>
      <Grid size={leftPanelVisible ? 8 : 12}>
        <Box sx={{ height: "100%" }} >
          <Map>
            <MapData pinClickHandler={handlePinClick} />
          </Map>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SplitViewController;
