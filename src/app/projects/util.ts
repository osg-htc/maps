import {
	EsProject,
	Institution,
	InstitutionWithProjects,
	Project,
	ProjectWithESData,
	TopologyProject
} from "@/app/types/mapTypes";
import esProjects from "@/data/esProjects";

export const getInstitutionsWithProjects = async (): Promise<InstitutionWithProjects[]> => {

	console.log('Refreshing things');

	const projects = await getTopologyProjects();
	const institutions = await getInstitutions();
	const esProjects = await fetchElasticsearchProjects();

	const filteredProjects = await getFilteredProjects(projects, esProjects);

	return institutions.map((institution: Institution) => {
		const institutionProjects: ProjectWithESData[] = filteredProjects
				.filter((project) => project.InstitutionID === institution.id)
				.map((proj) => {
					const projectData = esProjects.find((elProj) => elProj.key === proj.Name);
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
}

export const getFilteredProjects = async (projects: TopologyProject[], esProjects: any[]): Promise<TopologyProject[]> => {
	const esProjectNames = new Set(esProjects.map((project) => project.key))
	return Object.values(projects).filter((project) => esProjectNames.has(project.Name));
}

const getTopologyProjects = async (): Promise<TopologyProject[]> => {
	let response = await fetch('https://topology.opensciencegrid.org/miscproject/json')
	if(!response.ok) {
		throw new Error('Failed to fetch topology projects')
	}
	return await response.json()
}

const getInstitutions = async (): Promise<Institution[]> => {
	let response = await fetch('https://topology-institutions.osg-htc.org/api/institution_ids')
	if(!response.ok) {
		throw new Error('Failed to fetch institutions')
	}
	return await response.json()
}

const fetchElasticsearchProjects = async () : Promise<EsProject[]> => {
	const response = await esProjects();
	return response.aggregations.projects.buckets;
};
