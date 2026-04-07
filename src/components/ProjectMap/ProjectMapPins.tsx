import ProjectMapPin from '../MapPin'

export type ProjectMapPinProps = {
  name: string
  num: string,
  lat: number,
  lon: number,
  onClick: () => void,
}

export default function ProjectMapPins({ pins }: { pins: ProjectMapPinProps[] }) {
  return !pins ? <></> : (
    <>
      {pins.map((pin, i) => (
        <ProjectMapPin
          key={i}
          name={ pin.name }
          text={pin.num}
          color={'primary.main'}
          size={40}
          lat={pin.lat}
          lon={pin.lon}
          onClick={pin.onClick}
        />
      ))}
    </>
  )
}