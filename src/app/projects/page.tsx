
import Head from 'next/head';
import Box from '@mui/material/Box';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useMemo } from 'react';
import Config from './config';
import {
  getInstitutionsWithProjects,
} from "@/app/projects/util";

const Page= async() => {

  const institutionsWithProjects = await getInstitutionsWithProjects();

  return (
    <>
      {/*<NavigationButtons/>*/}
      <Head>
        <link
          rel='stylesheet'
          href='https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css'
        />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Box height={'100vh'} width={'100vw'}>
        <Config
            initialInstitutionsWithProjects={institutionsWithProjects}
        />
      </Box>
    </>
  );
}

export default Page;
