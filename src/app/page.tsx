"use client"
import { GlobeComponent } from '@/components/mapbox';
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, PopoverBody, UncontrolledPopover } from "reactstrap";


function HomePage() {
  return (
    <div className='container-fluid bg-gray-100'>
      <Head>
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
        />
      </Head>
      <div className='col-12 text-center'>
        <h1>OSG Global Institutions Map</h1>
        <GlobeComponent/>
      </div>
    </div>    
  );
}

export default HomePage;
