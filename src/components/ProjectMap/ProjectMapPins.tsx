import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';
import ProjectMapPin from '../MapPin'

export type ProjectMapPinProps = {
  name: string
  num: string,
  lat: number,
  lon: number,
  onClick: () => void,
}

export default function ProjectMapPins({ pins }: { pins: ProjectMapPinProps[] }) {
  console.log('pin names:', pins.map(p => p.name))
  console.log(pins)

  return !pins ? <></> : (
    <>
      {pins.map((pin, i) => (
        <ProjectMapPin
          key={i}
          name={ pin.name }
          text={pin.num}
          color={'#FF5733'}
          size={40}
          lat={pin.lat}
          lon={pin.lon}
          onClick={pin.onClick}
        />
      ))}
    </>
  )
}