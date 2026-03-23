'use client'

import { LocationPin, Circle } from '@mui/icons-material';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';

function MapData() {
  return (
    <Box zIndex={999} sx={{ position: "relative", cursor: "pointer" }}>
      
      
      <LocationPin sx={{ // location pin has a hole in the top that we dont want...
        color: '#FF5733',
        fontSize: 40,
      }} />
      <Circle sx={{ // ...so we just fill it with a circle
        color: '#FF5733',
        fontSize: 25,
        position: "absolute",
        top: "35%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }} />


      <Typography sx={{
        color: "white",
        fontSize: 15,
        position: "absolute",
        top: "35%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}>{"test"}</Typography>
    </Box>
  )
}

export default MapData;
