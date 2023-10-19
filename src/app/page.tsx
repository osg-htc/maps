"use client"
import { GlobeComponent } from '@/components/mapbox';
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, PopoverBody, UncontrolledPopover } from "reactstrap";
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
    <h1>OSG Global Institutions Map</h1>
    <Box>
        <GlobeComponent/>
    </Box>  
    </Container>
    </>
  );
}

export default HomePage;
