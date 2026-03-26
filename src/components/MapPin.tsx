import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';

export type MapPinProps = {
  text: string,
  color: string,
  size: number,
  lat: number,
  lon: number,
  onClick: () => void,
}

function MapPin(props: MapPinProps) {
  
  return (
    <Marker
      latitude={props.lat}
      longitude={props.lon}
      anchor="bottom"
      onClick={props.onClick}
    >
      <Box zIndex={999} sx={{ position: "relative", cursor: "pointer" }}>
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
      </Box>
    </Marker>
  )
}

export default MapPin;
