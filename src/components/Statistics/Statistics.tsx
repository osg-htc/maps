'use client'

import { useEffect, useState } from "react";
import useSWR from 'swr'
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography, Stack } from '@mui/material';
import { getInstitutionsOverview } from '@/src/utils/adstash.mjs'


function StatisticsView() {

  const { data, error, isLoading } = useSWR([getInstitutionsOverview], () => getInstitutionsOverview());

  console.log(data)

  return (
    <>
      <Stack component={'div'} spacing={2} sx={{
        top: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: "#888",
        height: '100%',
        width: '100%'
      }}>
        <Box sx={{ backgroundColor: "blue", margin: 10 }}>
          <Typography>Hello World!</Typography>
        </Box>
        <Box sx={{ backgroundColor: "blue", margin: 10 }}>
          {isLoading
            ? "Loading..."
            : error
            ? "Error loading data"
            : `Loaded ${data}`
          }
        </Box>
      </Stack>
    </>
  )
}

export default StatisticsView;
