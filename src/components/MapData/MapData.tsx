'use client'

import { ReactNode, useEffect, useState } from "react";
import useSWR from 'swr';
import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';
import { getProjects } from '@/src/utils/adstash.mjs'
import MapMarkerContent from "@/src/components/MapMarkerContent";

function MapData({pinClickHandler}: {pinClickHandler: () => void}) {
  const { data, error, isLoading } = useSWR([getProjects], () => getProjects());
  const bins: Record<string, any[]> = {};

  if (!data) return <></>

  Object.values(data).forEach((project: any) => {
    if (project.projectInstitutionLatitude === undefined) {
      console.log(project);
      return
    }
    if (!bins[project.projectInstitutionName]) bins[project.projectInstitutionName] = []
    bins[project.projectInstitutionName].push(project)
  })

  console.log(bins)

  return (
    <>
      {Object.values(bins).map((bin) => (
        <Marker
          key={bin[0].projectInstitutionName}
          latitude={bin[0].projectInstitutionLatitude}
          longitude={bin[0].projectInstitutionLongitude}
          anchor="bottom"
          onClick={pinClickHandler}
        >
          <MapMarkerContent />
        </Marker>
      ))}
    </>
  )
}

export default MapData;
