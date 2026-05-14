'use client'

import MapPin from '../MapPin'
import { InstitutionData, ProjectData } from '@/src/utils/adstash';
import ArrowPopUp from '../ArrowPopUp';
import { Typography } from '@mui/material';
import { numberWithCommas } from '@/src/utils/helpers';
import MapPinContents from '../MapPinContents';
import InstitutionContributionBar from './InstitutionContributionBar';

export default function InstitutionPins({ mainPin, institutionPins }: { mainPin: ProjectData, institutionPins: Record<string, Partial<InstitutionData>> | undefined }) {
  console.log(institutionPins)

  const filteredProjectContributors: Record<string, InstitutionData> = Object.fromEntries(
    Object.entries(institutionPins ?? []).filter(([, p]) =>
      p.institutionName &&
      p.institutionName !== mainPin.projectInstitutionName &&
      p.institutionLatitude &&
      p.institutionLongitude
    )
  ) as Record<string, InstitutionData>;

  const filteredProjectContributorsArray = Object.values(filteredProjectContributors)


  // A project that has jobs should never be able to have no contributing institutions, 
  // but if it does, we just return the main pin here and ignore the bars
  if (filteredProjectContributorsArray.length < 1) {
    return (
      <MapPin
        lat={mainPin.projectInstitutionLatitude}
        lon={mainPin.projectInstitutionLongitude}
        onTop
        content={<MapPinContents color='secndary.main' size={40}/>}
      />
    )
  }

  const largestContributor = filteredProjectContributorsArray.reduce((max, current) => 
    current.numJobs > max.numJobs ? current : max
  );

  return (
      <>
        <MapPin
          lat={mainPin.projectInstitutionLatitude}
          lon={mainPin.projectInstitutionLongitude}
          onTop
          content={<MapPinContents color='secndary.main' size={40}/>}
          
        />
      {filteredProjectContributorsArray.map((pin) => (
        <MapPin
          key={pin.institutionName}
          lat={pin.institutionLatitude}
          lon={pin.institutionLongitude}
          extraZ={9000 - Math.floor(pin.institutionLatitude*100)} // must be an integer, have to scale to capture decimals
          content={<InstitutionContributionBar backgroundColor={`primary.main`} width={10} height={((pin.numJobs / largestContributor.numJobs) * 150) + 10} />}
            popUp={
              <ArrowPopUp left={true}>
                <Typography noWrap variant="body1" color={"secondary.main"}>
                  {pin.institutionName}
                </Typography>
                <Typography noWrap variant="subtitle2" lineHeight={ 1 } color={"secondary.main"}>
                  {numberWithCommas(pin.numJobs)} Jobs
                </Typography>
              </ArrowPopUp>
            }
          />
        ))}
      </>
    )
}