import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';
import ProjectMapPin from '../MapPin'
import { ProjectData } from '@/src/utils/adstash';

export type ProjectMapContributorPinProps = {
  name: string
  num: string,
  lat: number,
  lon: number,
}

export default function ProjectMapContributorPins({ mainPin, contributorPins }: { mainPin: ProjectData, contributorPins: ProjectMapContributorPinProps[] }) {
  return (
    <>
      <ProjectMapPin
        key={-1}
        name={ mainPin.projectName }
        text={""}
        color={'#FF5733'}
        size={40}
        lat={mainPin.projectInstitutionLatitude}
        lon={mainPin.projectInstitutionLongitude}
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