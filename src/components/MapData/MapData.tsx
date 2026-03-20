'use client'

import { ReactNode, useEffect, useState } from "react";
import useSWR from 'swr';
import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';
import { getProjects } from '@/src/utils/adstash.mjs'

function MapData() {
  const { data, error, isLoading } = useSWR([getProjects], () => getProjects());
  const bins: Record<string, any[]> = {};

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
      { Object.values(bins).map((bin) => (<Marker
        key={bin[0].projectInstitutionName}
        latitude={bin[0].projectInstitutionLatitude}
        longitude={bin[0].projectInstitutionLongitude}
        anchor="bottom"
      >
        <Box zIndex={999} sx={{ position: "relative", cursor: "pointer" }}>
          <LocationPin sx={{
            color: '#FF5733',
            fontSize: 40,
          }} />
          <Circle sx={{
            color: '#FF5733',
            fontSize: 25,
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }} />
          <Typography sx={{
            color: "white",
            fontSize: 15,
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}>{bin.length}</Typography>
          
        </Box>
      </Marker>)) }
    </>
  )
}

export default MapData;
