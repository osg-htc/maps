'use client';

import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';
import { ReactNode, useRef, useState } from 'react';

export type MapPinProps = {
  name?: string
  text?: number,
  color: string,
  size: number,
  lat: number,
  lon: number,
  hidden?: boolean,
  onClick?: () => void,
  onTop?: boolean,
  children?: ReactNode
}

export default function MapPin(props: MapPinProps) {
  const [hovered, setHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setHovered(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setHovered(false);
  };

  return (
    <Marker
      key={ props.name }
      latitude={props.lat}
      longitude={props.lon}
      anchor="bottom"
      onClick={props.onClick}
      style={{
        zIndex: hovered ? 1000 : props.onTop ? 500 : (props.text ?? 1)
      }}
    >
      <Box
        sx={{
          position: "relative",
          cursor: "pointer",
          display: props.hidden ? "none" : "block",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
        {hovered && props.children}
      </Box>
    </Marker>
  )
}
