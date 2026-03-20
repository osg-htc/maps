'use client'

import {ReactNode, useEffect, useState} from "react";
import Map from "react-map-gl/mapbox"
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography, Stack } from '@mui/material';
import { Storage, TripOrigin } from '@mui/icons-material';
import {Marker as MbMarker} from 'react-map-gl/mapbox';


function StatisticsView() {

  return (
    <>
      <Stack component={'div'} spacing={2} sx={{
        top: 0,
        left: 0,
        zIndex: 999,
        height: '100%',
        width: '100%'
      }}>
        <Box sx={{ backgroundColor: "blue", margin: 10 }}>
          <Typography>Hello World</Typography>
        </Box>
        <Box sx={{ backgroundColor: "blue", margin: 10 }}>
          <Typography>Hello World</Typography>
        </Box>
      </Stack>
    </>
  )
}

export default StatisticsView;
