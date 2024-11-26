import ElasticSearchQuery, { DATE_RANGE, OSPOOL_FILTER } from './eqProjects';

const esProjects = async () => {
  const elasticSearch = new ElasticSearchQuery();

  let usageQueryResult = await elasticSearch.search({
    size: 0,
    query: {
      bool: {
        filter: [
          {
            term: { ResourceType: 'Payload' },
          },
          {
            range: {
              EndTime: {
                lte: DATE_RANGE.now,
                gte: DATE_RANGE.oneYearAgo,
              },
            },
          },
          OSPOOL_FILTER,
        ],
      },
    },
    aggs: {
      projects: {
        terms: {
          field: 'ProjectName',
          size: 99999999,
        },
        aggs: {
          projectCpuUse: {
            sum: {
              field: 'CoreHours',
            },
          },
          projectGpuUse: {
            sum: {
              field: 'GPUHours',
            },
          },
          projectJobsRan: {
            sum: {
              field: 'Njobs',
            },
          },
        },
      },
    },
  });

  const ospool_projects: Set<string> = new Set(await(await fetch("https://osg-htc.org/ospool-data/data/ospool_projects.json")).json())
  const osgconnect_projects: Set<string> = new Set(await(await fetch("https://osg-htc.org/assets/data/osgconnect_projects.json")).json())
  const validProjects = new Set([...ospool_projects, ...osgconnect_projects])

  // Remove invalid projects from es return
  for (let i = 0; i < usageQueryResult.aggregations.projects.buckets.length; i++) {
    if (!validProjects.has(usageQueryResult.aggregations.projects.buckets[i].key)) {
      usageQueryResult.aggregations.projects.buckets.splice(i, 1);
      i--;
    }
  }

  return usageQueryResult;
};

export default esProjects;
