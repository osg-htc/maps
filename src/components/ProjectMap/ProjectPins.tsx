import MapPin from '../MapPin'

export type ProjectPinProps = {
  name: string
  num: string,
  lat: number,
  lon: number,
  onClick: () => void,
}

export default function ProjectMapPins({ pins, hidden = false }: { pins: ProjectPinProps[], hidden?: boolean }) {
  return !pins ? <></> : (
    <div>
      {pins.map((pin, i) => (
        <MapPin
          key={i}
          name={ pin.name }
          text={pin.num}
          color={'primary.main'}
          size={40}
          lat={pin.lat}
          lon={pin.lon}
          hidden={hidden}
          onClick={pin.onClick}
        />
      ))}
    </div>
  )
}