import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Tooltip, Typography } from '@mui/material';

export type MapPinProps = {
  name?: string
  text?: string,
  color: string,
  size: number,
  lat: number,
  lon: number,
  onClick?: () => void,
}

function MapPin(props: MapPinProps) {
  
  return (
    <Marker
      key={ props.name }
      latitude={props.lat}
      longitude={props.lon}
      anchor="bottom"
      onClick={props.onClick}
    >
      {/* <Tooltip
        title={props.name}
        arrow
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -14]
                }
              }
            ]
          }
        }}
      > */}
        <Box zIndex={999} sx={props.onClick ? { position: "relative", cursor: "pointer" } : { position: "relative" }}>
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
      {/* </Tooltip> */}
    </Marker>
  )
}


export default MapPin;
