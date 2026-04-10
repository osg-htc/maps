'use client'

import PersonMapPin from '@/src/components/PersonMapPin'
import { InstitutionData, ProjectData, getInstitutionOverview } from '@/src/utils/adstash';
import useSWR from 'swr';
import { useMemo } from 'react';
import LoadingScreen from '@/src/components/LoadingScreen';

export default function ProjectPins({ institution }: { institution: InstitutionData }) {

  const { data: institutionData, isLoading: isInstitutionLoading } = useSWR([institution, getInstitutionOverview], () => getInstitutionOverview(institution.institutionName));

  const filteredProjects: Record<string, ProjectData> = useMemo(() => {
    const filtered = Object.fromEntries(
      Object.entries(institutionData ?? {}).filter(([_, p]) =>
        p.projectInstitutionName &&
        p.projectInstitutionName !== institution.institutionName &&
        p.projectInstitutionLatitude &&
        p.projectInstitutionLongitude
      )
    ) as Record<string, ProjectData>;

    // Log all project institutions that get pins
    if (Object.keys(filtered).length > 0) {
      console.log(`\n=== Pins for ${institution.institutionName} ===`);
      const institutionNames = Object.values(filtered)
        .map(project => project.projectInstitutionName)
        .filter((name, index, self) => self.indexOf(name) === index); // unique names
      institutionNames.forEach(name => console.log(name));
      console.log(`Total: ${institutionNames.length} unique institutions\n`);
    }

    return filtered;
  }, [institutionData, institution]);

  return (isInstitutionLoading || !institutionData)
    ? <LoadingScreen></LoadingScreen>
    : (
      <>
        {Object.values(filteredProjects).map((pin, i) => (
          <PersonMapPin
            key={i}
            name={ pin.projectName }
            color={'secondary.main'}
            size={30}
            lat={pin.projectInstitutionLatitude}
            lon={pin.projectInstitutionLongitude}
          />
        ))}
      </>
    )
}
