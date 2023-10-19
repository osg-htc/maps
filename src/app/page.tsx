"use client"
import { GlobeComponent } from '@/components/mapbox';
import Head from "next/head";
import { Box, Autocomplete, TextField, Container  } from '@mui/material';


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
    <Container>
    <Box>
        <GlobeComponent/>
    </Box>  
    </Container>
    </>
  );
}

export default HomePage;
