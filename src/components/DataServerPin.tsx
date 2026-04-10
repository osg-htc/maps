'use client';

import { Storage, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';

export type DataServerPinProps = {
  name?: string
  serverType?: string
  color: string,
  size: number,
  lat: number,
  lon: number,
  hidden?: boolean,
  onClick?: () => void,
  zIndex?: number
}

export default function DataServerPin(props: DataServerPinProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Marker
      key={ props.name }
      latitude={props.lat}
      longitude={props.lon}
      anchor="bottom"
      onClick={props.onClick}
      style={{ zIndex: props.zIndex ?? 123123 }}
    >
      <Box
        sx={{
          position: "relative",
          cursor: props.onClick ? "pointer" : "",
          display: props.hidden ? "none" : "block"
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Circle sx={{
          color: props.color,
          fontSize: props.size * 1.2,
        }} />
        <Storage sx={{
          color: 'white',
          fontSize: props.size * 0.6,
          position: "absolute",
          top: "41%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }} />
        {hovered && props.name &&
          <Paper elevation={3} sx={{
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: -80,
            left: props.size / 2 + 5,
            padding: 1.5,
            zIndex: 10000,
            minWidth: "220px",
            bgcolor: '#0a1725',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {props.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
              {props.serverType || 'OSDF Server'}
            </Typography>
          </Paper>
        }
      </Box>
    </Marker>
  )
}
