'use client'

import { useEffect, useState } from "react";
import useSWR from 'swr'
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography, Stack } from '@mui/material';
import { getProjects } from '@/src/utils/adstash.mjs'


function StatisticsView() {
  return (
    <>
      <Stack component={'div'} spacing={2} sx={{
        p: 2,
        top: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: "#000",
        boxSizing: 'border-box',
        minHeight: '100%',
        minWidth: '100%'
      }}>
        <Box sx={{ backgroundColor: "#333", height: 100, borderRadius: 5}}>
          <Typography>Hello World!</Typography>
        </Box>
        <Box sx={{ backgroundColor: "#333", height: 100, borderRadius: 5}}>
          <Typography>Hello World!</Typography>
        </Box>
        <Box sx={{ backgroundColor: "#333", height: 100, borderRadius: 5}}>
          <Typography>Hello World!</Typography>
        </Box>
      </Stack>
    </>
  )
}

export default StatisticsView;
