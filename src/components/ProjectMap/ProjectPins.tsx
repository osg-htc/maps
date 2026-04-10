import { Box, Card, Typography } from '@mui/material'
import MapPin from '../MapPin'

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
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              mt: 1.5, 
              padding: 1,
              zIndex: 1000,
              overflow: 'visible',
              // Tooltip arrow
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '50%',
                width: 12,
                height: 12,
                bgcolor: 'background.paper',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                borderTopLeftRadius: '2px',
                borderTop: '1px solid',
                borderLeft: '1px solid',
                borderColor: 'divider',
                zIndex: -1, 
              }
            }}
          >
            <Typography align="center" noWrap variant="subtitle2" lineHeight={ 1 } color={"secondary.main"}>
              {pin.name}
            </Typography>
          </Card>
        </MapPin>
      ))}
    </>
  )
}