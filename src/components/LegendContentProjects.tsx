import LegendEntry from './LegendEntry';
import MapPinContents from './MapPinContents';
import InstitutionContributionBar from './ProjectMap/InstitutionContributionBar';

export default function LegendContentInstitution() {
  return (
    <>
      <LegendEntry text='Project institution' icon={<MapPinContents color='secondary.main' size={30} />} />
      <LegendEntry text='Contributing institution' icon={<InstitutionContributionBar backgroundColor={`primary.main`} width={10} height={30} />} />
    </>
  )
}


