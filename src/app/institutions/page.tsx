'use client';
import Head from 'next/head';
import Box from '@mui/material/Box';
import 'mapbox-gl/dist/mapbox-gl.css';
import dynamic from 'next/dynamic';
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import NavigationButtons from "@/app/components/NavigationButtons";

const DynamicInstitutions = dynamic(
  () => import('./DynamicMapComponent'),
  {
    ssr: false,
    loading: () =>
        (<Box sx={{marginTop: '5em', textAlign: 'center'}}>
            <CircularProgress style={{color: 'darkorange', alignContent: 'center'}}/>
        </Box>)
  }
);

const Page: React.FC = () => (
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
      <DynamicInstitutions/>
    </Box>
  </>
);

export default Page;
