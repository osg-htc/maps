'use client'

import MapPin from '../MapPin'
import { getProjectOverview, InstitutionData, ProjectData } from '@/src/utils/adstash';
import { useMemo } from 'react';
import ArrowPopUp from '../ArrowPopUp';
import { Typography } from '@mui/material';
import { numberWithCommas } from '@/src/utils/helpers';
import MapPinContents from '../MapPinContents';
import useSWR from 'swr';
import fetchWithBackup from '@/src/utils/fetchWithBackup';
import InstitutionContributionBar from './InstitutionContributionBar';

export default function ProjectMapContributorPins({ mainPin }: { mainPin: ProjectData }) {
  const { data: projectOverviewResponse } = useSWR(
    [mainPin, getProjectOverview],
    () => fetchWithBackup(getProjectOverview, mainPin.projectName),
    { suspense: true }
  );
  
  const filteredProjectContributors: Record<string, InstitutionData> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(projectOverviewResponse.data).filter(([_, p]) =>
        p.institutionName &&
        p.institutionName !== mainPin.projectInstitutionName &&
        p.institutionLatitude &&
        p.institutionLongitude
      )
    ) as Record<string, InstitutionData>;
  }, [projectOverviewResponse.data, mainPin])

  const largestContributor = Object.values(filteredProjectContributors).reduce((max, current) => 
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
      {Object.values(filteredProjectContributors).map((pin, _) => (
        <MapPin
          key={pin.institutionName}
          lat={pin.institutionLatitude}
          lon={pin.institutionLongitude}
          extraZ={Math.floor(pin.institutionLatitude)}
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