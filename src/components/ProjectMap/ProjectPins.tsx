import { Typography } from '@mui/material'
import MapPin from '../MapPin'
import ArrowPopUp from '../ArrowPopUp'

export type ProjectPinProps = {
  name: string
  num: number,
  lat: number,
  lon: number,
  onClick: () => void,
}

export default function ProjectPins({ pins, hidden = false }: { pins: ProjectPinProps[], hidden?: boolean }) {
  return !pins ? <></> : (
    <>
      {pins.map((pin, i) => (
        <MapPin
          key={i}
          name={pin.name}
          text={pin.num}
          color={'primary.main'}
          size={40}
          lat={pin.lat}
          lon={pin.lon}
          hidden={hidden}
          onClick={pin.onClick}
        >
          <ArrowPopUp>
            <Typography align="center" noWrap variant="subtitle2" lineHeight={ 1 } color={"secondary.main"}>
              {pin.name}
            </Typography>
          </ArrowPopUp>
        </MapPin>
      ))}
    </>
  )
}