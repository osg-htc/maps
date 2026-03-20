'use client'

import {ReactNode, useEffect, useState} from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Grid } from '@mui/material';
import Map from "@/src/components/Map";
import Statistics from "@/src/components/Statistics";


function SplitView() {

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid size={6}>
        <Box sx={{ height: "100%" }} >
          <Statistics></Statistics>
        </Box>
      </Grid>
      <Grid size={6}>
        <Box sx={{ height: "100%" }} >
          <Map></Map>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SplitView;
