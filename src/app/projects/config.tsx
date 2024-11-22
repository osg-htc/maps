'use client'

import React, { useMemo } from 'react';
import useSWR from 'swr';
import MapComponent from '@/app/projects/MapComponent';
// @ts-ignore
import { Institution, Project, ProjectWithESData, InstitutionWithProjects } from '@/types/mapTypes';
import esProjects from '@/data/esProjects';


const fetchElasticsearchProjects = async () => {
  const response = await esProjects();
  return response.aggregations.projects.buckets;
};

const fetcher = (key: string) => {
  if (key === 'projects') {
    return fetch('https://topology.opensciencegrid.org/miscproject/json').then((res) => res.json());
  } else if (key === 'institutions') {
    return fetch('https://topology-institutions.osg-htc.org/api/institution_ids').then((res) => res.json());
  } else if (key === 'esProjects') {
    return fetchElasticsearchProjects();
  }
}

const Config: React.FC<{
  initialInstitutions: Institution[];
  initialProjects: Project[];
  initialEsProjects: any[];
}> = ({ initialInstitutions, initialProjects, initialEsProjects }) => {

  // console.log('initialInstitutions', initialInstitutions);
  // console.log('initialProjects', initialProjects);
  // console.log('initialEsProjects', initialEsProjects);
  const { data: institutions } = useSWR('institutions', fetcher, {
    fallbackData: initialInstitutions,
  });

  let { data: projects } = useSWR('projects', fetcher, {
    fallbackData: initialProjects,
  });

  const { data: esProjects } = useSWR('esProjects', fetcher, {
    fallbackData: initialEsProjects,
  });

  projects = useMemo(() => {
    if (!projects) return [];
    if (Array.isArray(projects)) {
      return projects;
    } else if (typeof projects === 'object' && projects !== null) {
      return Object.values(projects);
    } else {
      console.error('Unexpected projectsData format:', projects);
      return [];
    }
  }, [projects]);

  // console.log('institutions', institutions);
  // console.log('projects', projects);

  const filteredProjects = useMemo(() => {
    const projectNames = new Set(
      (esProjects || []).map((project: Project) => project.key)
    );
    return (projects || []).filter((project: Project) => projectNames.has(project.Name));
  }, [esProjects, projects]);

  const institutionsWithProjects: InstitutionWithProjects[] = useMemo(() => {
    return (institutions || []).map((institution: Institution) => {
      const institutionProjects: ProjectWithESData[] = filteredProjects
        .filter((project: Project) => project.InstitutionID === institution.id)
        .map((proj: Project) => {
          const projectData = (esProjects || []).find((elProj: Project) => elProj.key === proj.Name);
          return {
            ...proj,
            esData: {
              docCount: projectData?.doc_count || 0,
              cpuHours: projectData?.projectCpuUse?.value || 0,
              gpuHours: projectData?.projectGpuUse?.value || 0,
              jobsRan: projectData?.projectJobsRan?.value || 0,
            },
          };
        });

      return {
        ...institution,
        projects: institutionProjects,
      };
    }).filter((iwp: { projects: ProjectWithESData[] }) => iwp.projects.length > 0);
  }, [institutions, filteredProjects, esProjects]);

  // console.log('institutionsWithProjects', institutionsWithProjects);

  return (
    <MapComponent
      institutionsWithProjects={institutionsWithProjects}
      filteredProjects={filteredProjects}
    />
  );
}

export default Config;