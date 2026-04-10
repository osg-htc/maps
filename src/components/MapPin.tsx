'use client';

import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';

export type MapPinProps = {
  name?: string
  text?: string,
  color: string,
  size: number,
  lat: number,
  lon: number,
  hidden?: boolean,
  popup?: boolean
  onClick?: () => void,
}

export default function MapPin(props: MapPinProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Marker
      key={ props.name }
      latitude={props.lat}
      longitude={props.lon}
      anchor="bottom"
      onClick={props.onClick}
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
        <LocationPin sx={{ // location pin has a hole in the top that we dont want...
          color: props.color,
          fontSize: props.size,
        }} />
        <Circle sx={{ // ...so we just fill it with a circle
          color: props.color,
          fontSize: props.size / 2,
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }} />
        <Typography sx={{
          color: "white",
          fontSize: props.size / 2,
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          {props.text}
        </Typography>
        {hovered &&
          <Paper elevation={3} sx={{borderRadius: 2, display: 'flex', flexDirection: 'column', position: 'absolute', top: -50, left: 25, padding: 1, zIndex: 10000, width: "260px"}}>
            <Typography variant="h6" color={"primary"}>name</Typography>
            <Typography variant={'subtitle2'}>
              Jobs
            </Typography>
            <Typography variant={'subtitle2'}>
              Bytes
            </Typography>
            <Typography variant={'subtitle2'}>
              Objects
            </Typography>
          </Paper>
        }
      </Box>
    </Marker>
  )
}
