'use client'

import {ReactNode, useState} from "react";
import Map from "react-map-gl/mapbox"
import 'mapbox-gl/dist/mapbox-gl.css';
import {Box} from '@mui/material';
import { useSearchParams } from "next/navigation";

function BaseMap({children}: {children: ReactNode}) {
  const [mounted, setMounted] = useState(true);
  const searchParams = useSearchParams();

  const sidebarHiddenSearchParam = searchParams.get('sidebarHidden')

  return (
    <>
      <Box component={'div'} style={{
        top: 0,
        left: 0,
        backgroundColor: "white",
        borderRadius: 1,
        height: '100%',
        width: '100%',
        maxHeight: '100vh',
        maxWidth: '100vw',
      }}>
        <Map
          // locked to specific domains, no need to put in .env
          mapboxAccessToken="pk.eyJ1IjoiY2Fubm9uLWxvY2siLCJhIjoiY21tMTUxbjhqMDVnaDJxcHE2eWp6aGo2ZiJ9.oZFr4GezivM26AkP87Cg-w"
          initialViewState={{
            longitude: -97.4,
            latitude: 37.8,
            zoom: 3,
            padding: {
              left: sidebarHiddenSearchParam ? 0 : 400
            }
          }}
          projection={'globe'}
          style={{width: "100%", height: "100%"}}
          mapStyle={"mapbox://styles/mapbox/light-v11"} // "mapbox://styles/cannon-lock/cm9u8lv2400fd01qt9yvj8nyz/draft"
          onLoad={() => setMounted(true)}
        >
          {mounted && children}
        </Map>
      </Box>
    </>
  )
}

export default BaseMap;
