/**
 * Used to query the osg GRACC accounting endpoint
 *
 * This endpoint uses Elasticsearch
 */
import { subYears, subMonths } from 'date-fns';

const SUMMARY_INDEX = 'gracc.osg.summary';
const ENDPOINT = 'https://gracc.opensciencegrid.org/q';
const DEBUG = true;
const DATE_RANGE = {
  oneYearAgo: subYears(new Date(), 1).getTime(),
  threeMonthsAgo: subMonths(new Date(), 3).getTime(),
  now: new Date().getTime(),
};

const OSPOOL_FILTER = {
  regexp: {
    ProbeName: {
      value:
        '.*(osgconnect.net|grid.uchicago.edu|ci-connect.net|xd-login.opensciencegrid.org|SUBMIT.MIT.EDU|csiu.grid.iu.edu|otsgrid.iit.edu|workflow.isi.edu|lsst-glidein.rcac.purdue.edu|scosg16.jlab.org|gluex.phys.uconn.edu|login.duke.ci-connect.net|huxley-osgsub-001.sdmz.amnh.org|pcf-osg.t2.ucsd.edu|login.ci-connect.uchicago.edu|pcf-osg.t2.ucsd.edu|login.ci-connect.uchicago.edu|aragon.cyverse.org|akbul.cyverse.org|glidein-1.sbgrid.org|ce1.opensciencegrid.org|descmp3.cosmology.illinois.edu|osg-learn.chtc.wisc.edu|xd-submit0000.chtc.wisc.edu|login.snowmass21.io|nsgosg.sdsc.edu|osgsub01.sdcc.bnl.gov|uc.osg-htc.org|uw.osg-htc.org)',
    },
  },
};

class ElasticSearchQuery {
  constructor(index, endpoint) {
    this.index = index;
    this.endpoint = endpoint;
  }

  /**
   * Makes a request to the Elasticsearch API
   * @param url - The url to make the request too
   * @param body - The Object to be used as data
   * @param options - Additional Fetch request options
   * @returns Object - A JSON object
   */
  async make_request(url, body = {}, options = {}) {
    let response = await fetch(url, {
      ...options,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(await response.json());
      throw `Invalid Response from ${url}`;
    }

    return await response.json();
  }

  /**
   * Helper for Elasticsearch searches
   *
   * @param body - The object representative of the search
   * @param options - Any additional fetch options
   * @returns Object - A JSON object
   */
  async search(body, ...options) {
    let url = `${this.endpoint}/${this.index}/_search`;
    let method = 'POST';

    return await this.make_request(url, body, { method: method, ...options });
  }
}

async function getFacilityEsData(ospoolOnly = false) {
  let es = new ElasticSearchQuery(SUMMARY_INDEX, ENDPOINT);

  // Query ES and ask for Sites that have provided resources in the last year
  let response = await es.search({
    size: 0,
    query: {
      bool: {
        filter: [
          { term: { ResourceType: 'Payload' } },
          {
            range: {
              EndTime: {
                lte: DATE_RANGE['now'],
                gte: DATE_RANGE['oneYearAgo'],
              },
            },
          },
          ...(ospoolOnly ? [OSPOOL_FILTER] : []), // Cryptic but much cleaner
        ],
        must_not: [{ term: { ProjectName: 'GLOW' } }],
      },
    },
    aggs: {
      fieldsOfScience: { cardinality: { field: 'OIM_FieldOfScience' } },
      jobsRan: { sum: { field: 'Count' } },
      projects: { cardinality: { field: 'ProjectName' } },
      facilities: {
        terms: {
          field: 'OIM_Facility',
          size: 99999999,
        },
        aggs: {
          facilityCpuProvided: { sum: { field: 'CoreHours' } },
          facilityJobsRan: { sum: { field: 'Count' } },
          facilityGpuProvided: { sum: { field: 'GPUHours' } },
          countProjectsImpacted: { cardinality: { field: 'ProjectName' } },
          countFieldsOfScienceImpacted: {
            cardinality: { field: 'OIM_FieldOfScience' },
          },
          countOrganizationImpacted: {
            cardinality: { field: 'OIM_Organization' },
          },
          gpu_bucket_filter: {
            bucket_selector: {
              buckets_path: {
                totalGPU: 'facilityGpuProvided',
                totalCPU: 'facilityCpuProvided',
              },
              script: 'params.totalGPU > 0 || params.totalCPU > 0',
            },
          },
        },
      },
    },
  });

  // Decompose this data into information we want, if they provided GPU or CPU
  let facilityBuckets = response.aggregations.facilities.buckets;
  let facilityData = facilityBuckets.reduce((p, v) => {
    p[v['key']] = {
      name: v['key'],
      jobsRan: v['facilityJobsRan']['value'],
      cpuProvided: v['facilityCpuProvided']['value'],
      gpuProvided: v['facilityGpuProvided']['value'],
      numProjects: v['countProjectsImpacted']['value'],
      numFieldsOfScience: v['countFieldsOfScienceImpacted']['value'],
      numOrganizations: v['countOrganizationImpacted']['value'],
    };
    return p;
  }, {});
  return facilityData;
}

export { getFacilityEsData };
