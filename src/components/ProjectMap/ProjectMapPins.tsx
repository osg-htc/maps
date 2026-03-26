import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';
import ProjectMapPin from '../MapPin'

export type ProjectMapPinsProps = {
  key: string,
  num: string,
  lat: number,
  lon: number,
  onClick: () => void,
}

function ProjectMapData({ pinBins }: { pinBins: ProjectMapPinsProps[] }) {
  return !pinBins ? <></> : (
    <>
      {pinBins.map((props) => (
        <ProjectMapPin
          key={props.key}
          text={props.num}
          color={'#FF5733'}
          size={40}
          lat={props.lat}
          lon={props.lon}
          onClick={props.onClick}
        />
      ))}
    </>
  )
}

export default ProjectMapData;
