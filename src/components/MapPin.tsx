'use client';

import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';
import { ReactNode, useRef, useState } from 'react';
import MapPinContents from './MapPinContents';

export type MapPinProps = {
  lat: number,
  lon: number,
  hidden?: boolean,
  extraZ?: number,
  onTop?: boolean,
  onClick?: () => void,
  popUp?: ReactNode
  content: ReactNode
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
      // key={ props.listKey }
      latitude={ props.lat }
      longitude={ props.lon }
      anchor="bottom"
      onClick={ props.onClick }
      style={{
        zIndex: hovered ? 1000 : props.onTop ? 500 : (props.extraZ)
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
        {props.content}
        {hovered && props.popUp}
      </Box>
    </Marker>
  )
}
