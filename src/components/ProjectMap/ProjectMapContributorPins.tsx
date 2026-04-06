import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';
import ProjectMapPin from '../MapPin'

export type ProjectMapContributorPinProps = {
  name: string
  num: string,
  lat: number,
  lon: number,
}

export default function ProjectMapContributorPins({ mainPin, contributorPins }: { mainPin:ProjectMapContributorPinProps, contributorPins: ProjectMapContributorPinProps[] }) {
  return (
    <>
      <ProjectMapPin
        key={-1}
        name={ mainPin.name }
        text={""}
        color={'#FF5733'}
        size={40}
        lat={mainPin.lat}
        lon={mainPin.lon}
      />
      {contributorPins.map((pin, i) => (
        <ProjectMapPin
          key={i}
          name={ pin.name }
          text={pin.num}
          color={'#33cfff'}
          size={30}
          lat={pin.lat}
          lon={pin.lon}
        />
      ))}
    </>
  )
}