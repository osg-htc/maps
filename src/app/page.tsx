"use client"
import Box from '@mui/material/Box';
import MapComponent from '@/components/MapComponent';
import Head from 'next/head';


function HomePage() {
  return (
    <>
    <Head>
      <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet"/>
    </Head>
    <Box className="map-container">
    <MapComponent/>
    </Box>
    </>
  );
}

export default HomePage;
