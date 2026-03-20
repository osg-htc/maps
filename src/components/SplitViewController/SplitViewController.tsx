'use client'

import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Grid } from '@mui/material';
import Map from "@/src/components/Map";
import MapData from "@/src/components/MapData";
import Statistics from "@/src/components/Statistics";


function SplitViewController() {

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid size={4}>
        <Box sx={{ height: "100%" }} >
          <Statistics></Statistics>
        </Box>
      </Grid>
      <Grid size={8}>
        <Box sx={{ height: "100%" }} >
          <Map>
            <MapData />
          </Map>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SplitViewController;
