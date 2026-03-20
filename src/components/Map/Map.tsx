'use client'

import {ReactNode, useEffect, useState} from "react";
import Map from "react-map-gl/mapbox"
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';
import { Storage, TripOrigin } from '@mui/icons-material';
import {Marker as MbMarker} from 'react-map-gl/mapbox';


function BaseMap({children}: {children: ReactNode}) {

  const [mounted, setMounted] = useState(false);

  return (
    <>
      <Box component={'div'} style={{
        top: 0,
        left: 0,
        backgroundColor: "white",
        borderRadius: 1,
        zIndex: 999,
        height: '100%',
        width: '100%',
        // maxHeight: '100vh',
        // maxWidth: '100vw',
      }}>
        <Map
          mapboxAccessToken="pk.eyJ1IjoiY2Fubm9uLWxvY2siLCJhIjoiY21tMTUxbjhqMDVnaDJxcHE2eWp6aGo2ZiJ9.oZFr4GezivM26AkP87Cg-w"
          initialViewState={{
            longitude: -92.4,
            latitude: 37.8,
            zoom: 3
          }}
          projection={'globe'}
          style={{width: "100%", height: "100%"}}
          mapStyle={"mapbox://styles/mapbox/light-v11"} // "mapbox://styles/cannon-lock/cm9u8lv2400fd01qt9yvj8nyz/draft"
          onLoad={() => setMounted(true)}
        >
          {mounted && children}
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
    </>
  )
}

export default BaseMap;
