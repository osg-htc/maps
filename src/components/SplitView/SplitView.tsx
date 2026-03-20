'use client'

import {ReactNode, useEffect, useState} from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Grid } from '@mui/material';
import Map from "@/src/components/Map";
import Statistics from "@/src/components/Statistics";

import { Storage, TripOrigin } from '@mui/icons-material';
import {Marker as MbMarker} from 'react-map-gl/mapbox';


function SplitView() {

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
            <MbMarker
            key={`1`}
            latitude={41.787994}
            longitude={-87.599539}
            color="#FF5733"
            offset={[0, 0]}
            style={{
              cursor: 'pointer',
            }}
          >
            <Box zIndex={99999999}>
              <Box sx={{backgroundColor: "black", borderRadius: "50%", padding: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1001}}>
                <Storage color={"primary"} />
              </Box>
            </Box>
          </MbMarker>
          </Map>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SplitView;
