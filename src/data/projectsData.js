
import esProjects from '../../data/esProjects';

export async function getStaticProps() {
  try {
    const institutionsResponse = await fetch('https://topology-institutions.osg-htc.org/api/institution_ids');
    const institutions = await institutionsResponse.json();

    const projectsResponse = await fetch('https://topology.opensciencegrid.org/miscproject/json');
    const projects = await projectsResponse.json();

    const esResponse = await esProjects();
    const esProjects = esResponse.aggregations.projects.buckets;

    return {
      props: {
        institutions,
        projects,
        esProjects: esProjects,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching data on the server side:', error);
    return {
      props: {
        institutions: [],
        projects: [],
        elasticsearchProjects: [],
      },
    };
  }
}

export default function Page({ institutions, projects, elasticsearchProjects }) {
  return (
    <Page
      institutions={institutions}
      projects={projects}
      elasticsearchProjects={elasticsearchProjects}
    />
  );
}
