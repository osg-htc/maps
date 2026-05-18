import Image from 'next-image-export-optimizer';
import Link from 'next/link';
import LegendEntry from './LegendEntry';
import MapPinContents from './MapPinContents';
import { epscorColor, epscorNonR1Color, nonR1Color } from '../utils/helpers';

export default function LegendContentInstitutions() {
  return (
    <>
      <LegendEntry text='Project institutions' icon={<MapPinContents color='primary.main' size={30} />} />
      <LegendEntry text='Non-R1 Universities' icon={<MapPinContents color={nonR1Color} size={30} />} />
      <LegendEntry text='Project institutions in EPSCOR states' icon={<MapPinContents color={epscorColor} size={30} />} />
      <LegendEntry text='Non-R1 Universities in EPSCOR states' icon={<MapPinContents color={epscorNonR1Color} size={30} />} />
    </>
  )
}


