'use client'

import ProjectMapPin from '@/src/components/MapPin'
import { InstitutionData, ProjectData, getProjectOverview } from '@/src/utils/adstash';
import useSWR from 'swr';
import { useMemo } from 'react';
import LoadingScreen from '@/src/components/LoadingScreen';

export default function ProjectMapContributorPins({ project }: { project: ProjectData }) {

  const { data: projectData, isLoading: isProjectLoading } = useSWR([project, getProjectOverview], () => getProjectOverview(project.projectName));

    const filteredProjectContributors: Record<string, InstitutionData> = useMemo(() => {
      return Object.fromEntries(
        Object.entries(projectData ?? {}).filter(([_, p]) =>
          p.institutionName &&
          p.institutionName !== project.projectInstitutionName &&
          p.institutionLatitude &&
          p.institutionLongitude
        )
      ) as Record<string, InstitutionData>;
    }, [projectData, project])

  return (isProjectLoading || !projectData)
    ? <LoadingScreen></LoadingScreen>
    : (
      <>
        {Object.values(filteredProjectContributors).map((pin, i) => (
          <ProjectMapPin
            key={i}
            name={ pin.institutionName }
            color={'primary.main'}
            size={30}
            lat={pin.institutionLatitude}
            lon={pin.institutionLongitude}
          />
        ))}
      </>
    )
}