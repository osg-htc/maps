'use client'

import ProjectMapPin from '../MapPin'
import { InstitutionData, ProjectData, getProjectOverview } from '@/src/utils/adstash';
import useSWR from 'swr';
import { useMemo } from 'react';

export default function ProjectMapContributorPins({ mainPin }: { mainPin: ProjectData }) {
  const { data: projectData, isLoading: isProjectLoading } = useSWR([getProjectOverview], () => getProjectOverview(mainPin.projectName));

    const filteredProjectContributors: Record<string, InstitutionData> = useMemo(() => {
      return Object.fromEntries(
        Object.entries(projectData ?? {}).filter(([_, p]) =>
          p.institutionName &&
          p.institutionName !== mainPin.projectInstitutionName &&
          p.institutionLatitude &&
          p.institutionLongitude
        )
      ) as Record<string, InstitutionData>;
    }, [projectData, mainPin])


  console.log(projectData)

  return (isProjectLoading || !projectData) ? <></> : (
    <>
      <ProjectMapPin
        key={-1}
        name={ mainPin.projectName }
        color={'primary.main'}
        size={40}
        lat={mainPin.projectInstitutionLatitude}
        lon={mainPin.projectInstitutionLongitude}
      />
      {Object.values(filteredProjectContributors).map((pin, i) => (
        <ProjectMapPin
          key={i}
          name={ pin.institutionName }
          color={'secondary.main'}
          size={30}
          lat={pin.institutionLatitude}
          lon={pin.institutionLongitude}
        />
      ))}
    </>
  )
}