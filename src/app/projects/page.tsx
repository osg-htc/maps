
import Head from 'next/head';
import Box from '@mui/material/Box';
import 'mapbox-gl/dist/mapbox-gl.css';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import NavigationButtons from "@/app/components/NavigationButtons";
import useSWR from 'swr';
// @ts-ignore
import { Institution, Project, ProjectWithESData, InstitutionWithProjects } from '@/types/mapTypes';
import esProjects from '@/data/esProjects';
import MapComponent from '@/app/projects/MapComponent';

// const DynamicProjects = dynamic(
//   () => import('./MapComponent'),
//   {
//     ssr: false,
//     loading: () => (
//         <Box sx={{marginTop: '5em', textAlign: 'center'}}>
//             <CircularProgress style={{color: 'darkorange', alignContent: 'center'}}/>
//         </Box>
//     )
//   }
// );



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
    } else{
      throw new Error(`Unknown key: ${key}`);
    }
  }


const Page: React.FC<{institutions: Institution[]; projects: Project[]; esProjects: any[]}> = ({ institutions: initialInstitutions, projects: initialProjects, esProjects: initialEsProjects}) => {
  console.log('initialInstitutions', initialInstitutions);

  const { data: institutions } = useSWR('institutions', fetcher, {
    fallbackData: initialInstitutions,
  });

  let { data: projects } = useSWR('projects', fetcher, {
    fallbackData: initialProjects,
  });

  let { data: esProjects } = useSWR('esProjects', fetcher, {
    fallbackData: initialEsProjects,
  });

  // console.log('projects', projects);
  // console.log('elasticsearchProjects', esProjects);
  // console.log('institutions', institutions);

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
              cpuHours: projectData?.projectCpuUse.value || 0,
              gpuHours: projectData?.projectGpuUse.value || 0,
              jobsRan: projectData?.projectJobsRan.value || 0,
            }
          };
        });

      return {
        ...institution,
        projects: institutionProjects
      };
    }).filter((iwp: { projects: string | any[]; }) => iwp.projects.length > 0);
  }, [institutions, filteredProjects, esProjects]);

  // console.log('institutionsWithProjects', institutionsWithProjects);

  return (
    <>
      {/*<NavigationButtons/>*/}
      <Head>
        <link
          rel='stylesheet'
          href='https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css'
        />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Box height={'100vh'} width={'100vw'}>
        <MapComponent institutions={institutions} projects={projects} esProjects={esProjects} institutionsWithProjects={institutionsWithProjects} filteredProjects={filteredProjects}/>
      </Box>
    </>
  );
}

export default Page;
