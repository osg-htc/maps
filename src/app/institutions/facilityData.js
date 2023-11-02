async function getFacilityEsData(ospoolOnly = false){

    let es = new ElasticSearchQuery(SUMMARY_INDEX, ENDPOINT)

    // Query ES and ask for Sites that have provided resources in the last year
    let response = await es.search({
        "size": 0,
        "query": {
            "bool": {
                "filter": [
                    {"term": {"ResourceType": "Payload"}},
                    {"range": {"EndTime": {"lte": DATE_RANGE['now'], "gte": DATE_RANGE['oneYearAgo']}}},
                    ...(ospoolOnly ? [OSPOOL_FILTER] : []) // Cryptic but much cleaner
                ],
                "must_not": [
                    { "term" : {"ProjectName" : "GLOW"} },
                ]
            }
        },
        "aggs": {
            "fieldsOfScience": { "cardinality": { "field": "OIM_FieldOfScience" }, },
            "jobsRan": { "sum": { "field": "Count" } },
            "projects": { "cardinality": { "field": "ProjectName" } },
            "facilities": {
                "terms": {
                    "field": "OIM_Facility", "size": 99999999
                },
                "aggs": {
                    "facilityCpuProvided": {"sum": {"field": "CoreHours"}},
                    "facilityJobsRan": {"sum": {"field": "Count"}},
                    "facilityGpuProvided": {"sum": {"field": "GPUHours"}},
                    "countProjectsImpacted": {"cardinality": {"field": "ProjectName"}},
                    "countFieldsOfScienceImpacted": {"cardinality": {"field": "OIM_FieldOfScience"}},
                    "countOrganizationImpacted": {"cardinality": {"field": "OIM_Organization"}},
                    "gpu_bucket_filter": {
                        "bucket_selector": {
                            "buckets_path": {"totalGPU": "facilityGpuProvided", "totalCPU": "facilityCpuProvided"},
                            "script": "params.totalGPU > 0 || params.totalCPU > 0"
                        }
                    }
                }
            }
        }
    })

    // Decompose this data into information we want, if they provided GPU or CPU
    let facilityBuckets = response.aggregations.facilities.buckets
    let facilityData = facilityBuckets.reduce((p, v) => {
        p[v['key']] = {
            name: v['key'],
            jobsRan: v['facilityJobsRan']['value'],
            cpuProvided: v['facilityCpuProvided']['value'],
            gpuProvided: v['facilityGpuProvided']['value'],
            numProjects: v['countProjectsImpacted']['value'],
            numFieldsOfScience: v['countFieldsOfScienceImpacted']['value'],
            numOrganizations: v['countOrganizationImpacted']['value'],
        }
        return p
    }, {})
    console.log(facilityData)
    return facilityData
}