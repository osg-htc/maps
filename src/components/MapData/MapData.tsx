'use client'

import { ReactNode, useEffect, useState } from "react";
import { LocationPin } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Box} from '@mui/material';

function MapData() {

  return (
    <>
      <Marker
        key={`1`}
        latitude={41.787994}
        longitude={-87.599539}
        anchor="bottom"
      >
        <Box zIndex={99999999}>
          <LocationPin sx={{
            color: '#FF5733',
            cursor: 'pointer',
            fontSize: 40,
          }}/>
        </Box>
      </Marker>
    </>
  )
}

export default MapData;
