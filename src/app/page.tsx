"use client"


import Head from "next/head";
import { useMemo } from "react";
import { Box, Autocomplete, TextField, Container  } from '@mui/material';
import { Map, Marker } from "react-map-gl"
import Features from "../../public/features.json"

import {BusAlert} from "@mui/icons-material";

import 'mapbox-gl/dist/mapbox-gl.css';

function HomePage() {

  let markers = useMemo(() => {
    return Features.features.map((feature) => {
      return (
        <Marker
          key={feature.id}
          longitude={feature.geometry.coordinates[0]}
          latitude={feature.geometry.coordinates[1]}
        >
          <BusAlert/>
        </Marker>
      );
    });
  }, [Features])

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box height={"100vh"} width={"100vw"}>
        <Map
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          projection={"globe"}
        >
          {markers}
        </Map>
      </Box>
    </>
  );
}

export default HomePage;
