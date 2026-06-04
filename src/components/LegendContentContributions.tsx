import LegendEntry from './LegendEntry';
import MapPinContents from './MapPinContents';
import PersonIcon from '@mui/icons-material/Person';


export default function LegendContentContributions() {
  return (
    <>
      <LegendEntry text='Contributing institution' icon={<MapPinContents color='secondary.main' size={30} />} />
      <LegendEntry
        text='Project institutions'
        icon={
          <MapPinContents color='primary.main' size={30}>
            <PersonIcon
              sx={{
                fontSize: 15,
                color: 'white',
              }}
            />
          </MapPinContents>
        }
      />
    </>
  )
}


