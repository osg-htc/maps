import ElasticSearchQuery, { DATE_RANGE, OSPOOL_FILTER } from './eqProjects';

const esProjects = async () => {
  const elasticSearch = new ElasticSearchQuery();

  let usageQueryResult = elasticSearch.search({
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
  return usageQueryResult;
};

export default esProjects;
