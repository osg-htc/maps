"use client"

import Head from "next/head";
import  Box from '@mui/material/Box';
import MapComponent from '../app/components/MapComponent'
import 'mapbox-gl/dist/mapbox-gl.css';

function HomePage() {

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
        <MapComponent/>
      </Box>
    </>
  );
}

export default HomePage;
