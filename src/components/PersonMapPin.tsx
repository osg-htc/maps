'use client';

import { Person, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';

export type PersonMapPinProps = {
  name?: string
  text?: string,
  color: string,
  size: number,
  lat: number,
  lon: number,
  hidden?: boolean,
  popup?: boolean
  onClick?: () => void,
  zIndex?: number
}

export default function PersonMapPin(props: PersonMapPinProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Marker
      key={ props.name }
      latitude={props.lat}
      longitude={props.lon}
      anchor="bottom"
      onClick={props.onClick}
      style={{ zIndex: props.zIndex ?? 1 }}
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
        <Person sx={{
          color: 'white',
          fontSize: props.size * 0.7,
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }} />
        {props.text && (
          <Typography sx={{
            color: "white",
            fontSize: props.size / 3,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: 600
          }}>
            {props.text}
          </Typography>
        )}
        {hovered && props.name &&
          <Paper elevation={3} sx={{
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: -60,
            left: props.size / 2 + 5,
            padding: 1.5,
            zIndex: 10000,
            minWidth: "200px",
            bgcolor: '#0a1725',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {props.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
              Research Project
            </Typography>
          </Paper>
        }
      </Box>
    </Marker>
  )
}
