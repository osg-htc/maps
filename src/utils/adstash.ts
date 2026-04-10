/**
 * A collection of functions for uniform queries to the adstash Elasticsearch endpoint
 */

const ADSTASH_SUMMARY_INDEX: string = "ospool-summary-*"
const ADSTASH_ENDPOINT: string = "https://elastic.osg.chtc.io/q"

async function elasticSearch<T = unknown>(body: object = {}): Promise<T> {
  const url = `${ADSTASH_ENDPOINT}/${ADSTASH_SUMMARY_INDEX}/_search`

  const response = await Promise.race([
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 15000))
  ])

  if( !response.ok ){
    console.error(await response.json())
    throw Error(`Invalid Response from ${url}`)
  }

  return await response.json()
}


export type ComputeStats = {
  byteTransferCount: number 
  cpuHours: number 
  fileTransferCount: number 
  gpuHours: number 
  numJobs: number 
  osdfByteTransferCount: number 
  osdfFileTransferCount: number 
}

export type OverviewStats = ComputeStats & {
  numBroadFieldOfScience: number 
  numDetailedFieldOfScience: number 
  numInstitutions: number 
  numMajorFieldOfScience: number 
  numProjects: number 
}

export type InstitutionData = OverviewStats & {
  institutionCarnegieClassification2025: string 
  institutionIpedsHistoricallyBlackCollegeOrUniversity: boolean 
  institutionIpedsTribalCollegeOrUniversity: boolean 
  institutionIpedsWebsiteAddress: string 
  institutionName: string 
  institutionState: string 
  institutionLatitude: number
  institutionLongitude: number
}

export type OSPoolOverviewStats = OverviewStats & {
  date: Date
}

export type ProjectData = ComputeStats & {
  broadFieldOfScience: string 
  detailedFieldOfScience: string 
  majorFieldOfScience: string 
  projectEpscorState: boolean 
  projectInstitutionIpedsHistoricallyBlackCollegeOrUniversity: boolean 
  projectInstitutionIpedsTribalCollegeOrUniversity: boolean
  projectInstitutionIpedsWebsiteAddress: string
  projectInstitutionLatitude: number
  projectInstitutionLongitude: number
  projectInstitutionName: string
  projectInstitutionState: string
  projectName: string
}

const DATE_RANGE: Record<string, number> = {
    oneYearAgo: new Date(new Date().setDate(new Date().getDate()-365)).getTime(), // Gets last years timestamp
    threeMonthsAgo: new Date(new Date().setDate(new Date().getDate()-90)).getTime(), // Gets date object 90 days in advance
    now: new Date().getTime(),
    yesterday: new Date(new Date().setDate(new Date().getDate()-1)).getTime(),
}

export async function getDateOfLatestData(): Promise<Date | undefined> {
    const usageQueryResult: any = await elasticSearch({
        size: 1,
        sort: [
            {
                "Date": {
                    "order": "desc"
                }
            }
        ],
    })
    return new Date(usageQueryResult.hits.hits[0]._source.Date)
}

export async function getLatestOSPoolOverview(): Promise<Partial<OSPoolOverviewStats>> {
    let overview: Partial<OverviewStats> | null = null
    const d: Date = new Date()
    d.setUTCHours(0,0,0,0)
    while (!overview || overview['numJobs'] == 0) {
        d.setUTCDate(d.getUTCDate() - 1)
        overview = await getInstitutionsOverview(d.getTime(), d.getTime())
    }
  return { ...overview, date: d}
}

export async function getInstitutionsOverview(
  startTime: number = DATE_RANGE['oneYearAgo'], endTime: number = DATE_RANGE['now']
): Promise<Partial<OverviewStats>> {
  
  const usageQueryResult: any = await elasticSearch({
    size: 0,
    query: {
      range: {
        Date: {
          gte: startTime,
          lte: endTime
        }
      }
    },
    "aggs": {
      "NumInstitutions": {
        "terms": {
          "field": "ResourceInstitution.name.keyword",
          "size": 10000
        }
      },
      "NumProjects": {
        "terms": {
          "field": "ProjectName.keyword",
          "size": 10000
        }
      },
      "NumMajorFieldOfScience": {
        "terms": {
          "field": "MajorFieldOfScience.keyword",
          "size": 10000
        }
      },
      "NumBroadFieldOfScience": {
        "terms": {
          "field": "BroadFieldOfScience.keyword",
          "size": 10000
        }
      },
      "NumDetailedFieldOfScience": {
        "terms": {
          "field": "DetailedFieldOfScience.keyword",
          "size": 10000
        }
      },
      "NumJobs": {
        "sum": {
          "field": "NumJobs"
        }
      },
      "FileTransferCount": {
        "sum": {
          "field": "FileTransferCount"
        }
      },
      "ByteTransferCount": {
        "sum": {
          "field": "ByteTransferCount"
        }
      },
      "CpuHours": {
        "sum": {
          "field": "CpuHours"
        }
      },
      "GpuHours": {
        "sum": {
          "field": "GpuHours"
        }
      },
      "OSDFFileTransferCount": {
        "sum": {
          "field": "OSDFFileTransferCount"
        }
      },
      "OSDFByteTransferCount": {
        "sum": {
          "field": "OSDFByteTransferCount"
        }
      }
    }
  })

  const data = usageQueryResult.aggregations

  return {
    numInstitutions: data['NumInstitutions']['buckets'].length,
    numJobs: data['NumJobs']['value'],
    cpuHours: data['CpuHours']['value'],
    gpuHours: data['GpuHours']['value'],
    fileTransferCount: data['FileTransferCount']['value'],
    byteTransferCount: data['ByteTransferCount']['value'],
    osdfFileTransferCount: data['OSDFFileTransferCount']['value'],
    osdfByteTransferCount: data['OSDFByteTransferCount']['value'],
    numProjects: data['NumProjects']['buckets'].length,
    numMajorFieldOfScience: data['NumMajorFieldOfScience']['buckets'].length,
    numBroadFieldOfScience: data['NumBroadFieldOfScience']['buckets'].length,
    numDetailedFieldOfScience: data['NumDetailedFieldOfScience']['buckets'].length,
  }
}

export async function getInstitutions(
  startTime: number = DATE_RANGE['oneYearAgo'], endTime: number = DATE_RANGE['now']
): Promise<Record<string, Partial<InstitutionData>>> {
	
	const usageQueryResult: any = await elasticSearch({
		size: 0,
		query: {
			range: {
				Date: {
          gte: startTime,
          lte: endTime
				}
			}
		},
		"aggs": {
			"bucket": {
				"terms": {
					"field": "ResourceInstitution.name.keyword",
					"size": 10000
				},
				"aggs": {
					"NumProjects": {
						"terms": {
							"field": "ProjectName.keyword",
							"size": 10000
						}
					},
					"NumMajorFieldOfScience": {
						"terms": {
							"field": "MajorFieldOfScience.keyword",
							"size": 10000
						}
					},
					"NumBroadFieldOfScience": {
						"terms": {
							"field": "BroadFieldOfScience.keyword",
							"size": 10000
						}
					},
					"NumDetailedFieldOfScience": {
						"terms": {
							"field": "DetailedFieldOfScience.keyword",
							"size": 10000
						}
					},
					"NumJobs": {
						"sum": {
							"field": "NumJobs"
						}
					},
					"FileTransferCount": {
						"sum": {
							"field": "FileTransferCount"
						}
					},
					"ByteTransferCount": {
						"sum": {
							"field": "ByteTransferCount"
						}
					},
					"CpuHours": {
						"sum": {
							"field": "CpuHours"
						}
					},
					"GpuHours": {
						"sum": {
							"field": "GpuHours"
						}
					},
					"OSDFFileTransferCount": {
						"sum": {
							"field": "OSDFFileTransferCount"
						}
					},
					"OSDFByteTransferCount": {
						"sum": {
							"field": "OSDFByteTransferCount"
						}
					},
					"CommonFields": {
						"top_hits": {
							"_source": {
								"includes": RESOURCE_COMMON_FIELDS
							},
							"size": 1
						}
					}
				}
			}
		}
	})

	const buckets = usageQueryResult.aggregations.bucket.buckets

  return buckets.reduce((p: any, v: any) => {
    p[v['key']] = {
      institutionName: v['key'],
      numJobs: v['NumJobs']['value'],
      cpuHours: v['CpuHours']['value'],
      gpuHours: v['GpuHours']['value'],
      fileTransferCount: v['FileTransferCount']['value'],
      byteTransferCount: v['ByteTransferCount']['value'],
      osdfFileTransferCount: v['OSDFFileTransferCount']['value'],
      osdfByteTransferCount: v['OSDFByteTransferCount']['value'],
      numProjects: v['NumProjects']['buckets'].length,
      numMajorFieldOfScience: v['NumMajorFieldOfScience']['buckets'].length,
      numBroadFieldOfScience: v['NumBroadFieldOfScience']['buckets'].length,
      numDetailedFieldOfScience: v['NumDetailedFieldOfScience']['buckets'].length,
      institutionState: getFromCommonField<string>(v, "ResourceInstitution", "state"),
      institutionIpedsWebsiteAddress: getFromCommonField<string>(v, "ResourceInstitution", "ipeds_metadata", "website_address"),
      institutionIpedsHistoricallyBlackCollegeOrUniversity: getFromCommonField<boolean>(v, "ResourceInstitution", "ipeds_metadata", "historically_black_college_or_university"),
      institutionIpedsTribalCollegeOrUniversity: getFromCommonField<boolean>(v, "ResourceInstitution", "ipeds_metadata", "tribal_college_or_university"),
      institutionCarnegieClassification2025: getFromCommonField<string>(v, "ResourceInstitution", "carnegie_metadata", "classification2025"),
      institutionLatitude: getFromCommonField<number>(v, 'ResourceInstitution', 'latitude'),
      institutionLongitude: getFromCommonField<number>(v, 'ResourceInstitution', 'longitude'),
    }
    return p
  }, {})
}

export async function getProjects(
  startTime: number = DATE_RANGE['oneYearAgo'], endTime: number = DATE_RANGE['now']
): Promise<Record<string, Partial<ProjectData>>> {
  
  const usageQueryResult: any = await elasticSearch({
    size: 0,
    query: {
      range: {
        Date: {
          gte: startTime,
          lte: endTime
        }
      }
    },
    "aggs": {
      "bucket": {
        "terms": {
          "field": "ProjectName.keyword",
          "size": 10000
        },
        "aggs": {
          "NumJobs": {
            "sum": {
              "field": "NumJobs"
            }
          },
          "FileTransferCount": {
            "sum": {
              "field": "FileTransferCount"
            }
          },
          "ByteTransferCount": {
            "sum": {
              "field": "ByteTransferCount"
            }
          },
          "CpuHours": {
            "sum": {
              "field": "CpuHours"
            }
          },
          "GpuHours": {
            "sum": {
              "field": "GpuHours"
            }
          },
          "OSDFFileTransferCount": {
            "sum": {
              "field": "OSDFFileTransferCount"
            }
          },
          "OSDFByteTransferCount": {
            "sum": {
              "field": "OSDFByteTransferCount"
            }
          },
          "CommonFields": {
            "top_hits": {
              "_source": {
                "includes": PROJECT_COMMON_FIELDS
              },
              "size": 1
            }
          }
        }
      }
    }
  })

  const buckets = usageQueryResult.aggregations.bucket.buckets

  return buckets.reduce((p: any, v: any) => {
    p[v['key']] = {
      projectName: v['key'],
      numJobs: v['NumJobs']['value'],
      cpuHours: v['CpuHours']['value'],
      gpuHours: v['GpuHours']['value'],
      fileTransferCount: v['FileTransferCount']['value'],
      byteTransferCount: v['ByteTransferCount']['value'],
      osdfFileTransferCount: v['OSDFFileTransferCount']['value'],
      osdfByteTransferCount: v['OSDFByteTransferCount']['value'],
      broadFieldOfScience: getFromCommonField<string>(v, 'BroadFieldOfScience'),
      majorFieldOfScience: getFromCommonField<string>(v, 'MajorFieldOfScience'),
      detailedFieldOfScience: getFromCommonField<string>(v, 'DetailedFieldOfScience'),
      projectInstitutionName: getFromCommonField<string>(v, 'ProjectInstitution', 'name'),
      projectInstitutionIpedsWebsiteAddress: getFromCommonField<string>(v, 'ProjectInstitution', 'ipeds_metadata', 'website_address'),
      projectInstitutionIpedsHistoricallyBlackCollegeOrUniversity: getFromCommonField<boolean>(v, 'ProjectInstitution', 'ipeds_metadata', 'historically_black_college_or_university'),
      projectInstitutionIpedsTribalCollegeOrUniversity: getFromCommonField<boolean>(v, 'ProjectInstitution', 'ipeds_metadata', 'tribal_college_or_university'),
      projectInstitutionState: getFromCommonField<string>(v, 'ProjectInstitution', 'state'),
      projectInstitutionLatitude: getFromCommonField<number>(v, 'ProjectInstitution', 'latitude'),
      projectInstitutionLongitude: getFromCommonField<number>(v, 'ProjectInstitution', 'longitude'),
      projectEpscorState: EPSCOR_STATES.includes(getFromCommonField<string>(v, 'ProjectInstitution', 'state') ?? '')
    }
    return p
  }, {})
}

export async function getInstitutionOverview(institutionName: string): Promise<Record<string, Partial<ProjectData>>> {

	const usageQueryResult: any = await elasticSearch({
		size: 0,
		query: {
			bool: {
				filter: [
					{
						range: {
							Date: {
								lte: DATE_RANGE['now'],
								gte: DATE_RANGE['oneYearAgo']
							}
						},
					},
					{
						term: {
							["ResourceInstitution.name.keyword"]: institutionName,
						}
					}
				]
			}
		},
		"aggs": {
			"agg": {
				"terms": {
					"field": "ProjectName.keyword",
					"size": 10000
				},
				"aggs": {
					"NumJobs": {
						"sum": {
							"field": "NumJobs"
						}
					},
					"FileTransferCount": {
						"sum": {
							"field": "FileTransferCount"
						}
					},
					"ByteTransferCount": {
						"sum": {
							"field": "ByteTransferCount"
						}
					},
					"CpuHours": {
						"sum": {
							"field": "CpuHours"
						}
					},
					"GpuHours": {
						"sum": {
							"field": "GpuHours"
						}
					},
					"OSDFFileTransferCount": {
						"sum": {
							"field": "OSDFFileTransferCount"
						}
					},
					"OSDFByteTransferCount": {
						"sum": {
							"field": "OSDFByteTransferCount"
						}
					},
					"CommonFields": {
						"top_hits": {
							"_source": {
								"includes": PROJECT_COMMON_FIELDS
							},
							"size": 1
						}
					}
				}
			}
		}
	})

	const buckets = usageQueryResult.aggregations.agg.buckets

  return buckets.reduce((p: any, v: any) => {
    p[v['key']] = {
      projectName: v['key'],
      numJobs: v['NumJobs']['value'],
      cpuHours: v['CpuHours']['value'],
      gpuHours: v['GpuHours']['value'],
      fileTransferCount: v['FileTransferCount']['value'],
      byteTransferCount: v['ByteTransferCount']['value'],
      osdfFileTransferCount: v['OSDFFileTransferCount']['value'],
      osdfByteTransferCount: v['OSDFByteTransferCount']['value'],
      broadFieldOfScience: getFromCommonField<string>(v, 'BroadFieldOfScience'),
      majorFieldOfScience: getFromCommonField<string>(v, 'MajorFieldOfScience'),
      detailedFieldOfScience: getFromCommonField<string>(v, 'DetailedFieldOfScience'),
      projectInstitutionName: getFromCommonField<string>(v, 'ProjectInstitution', 'name'),
      projectInstitutionIpedsWebsiteAddress: getFromCommonField<string>(v, 'ProjectInstitution', 'ipeds_metadata', 'website_address'),
      projectInstitutionIpedsHistoricallyBlackCollegeOrUniversity: getFromCommonField<boolean>(v, 'ProjectInstitution', 'ipeds_metadata', 'historically_black_college_or_university'),
      projectInstitutionIpedsTribalCollegeOrUniversity: getFromCommonField<boolean>(v, 'ProjectInstitution', 'ipeds_metadata', 'tribal_college_or_university'),
      projectInstitutionState: getFromCommonField<string>(v, 'ProjectInstitution', 'state'),
      projectInstitutionLatitude: getFromCommonField<number>(v, 'ProjectInstitution', 'latitude'),
      projectInstitutionLongitude: getFromCommonField<number>(v, 'ProjectInstitution', 'longitude'),
      projectEpscorState: EPSCOR_STATES.includes(getFromCommonField<string>(v, 'ProjectInstitution', 'state') ?? '')
    }
    return p
  }, {})

}

export async function getProjectOverview(projectName: string): Promise<Record<string, Partial<InstitutionData>>> {
	
	const usageQueryResult: any = await elasticSearch({
		size: 0,
		query: {
			bool: {
				filter: [
					{
						range: {
							Date: {
								lte: DATE_RANGE['now'],
								gte: DATE_RANGE['oneYearAgo']
							}
						},
					},
					{
						term: {
							["ProjectName.keyword"]: projectName,
						}
					}
				]
			}
		},
		"aggs": {
			"agg": {
				"terms": {
					"field": "ResourceInstitution.name.keyword",
					"size": 10000
				},
				"aggs": {
					"NumJobs": {
						"sum": {
							"field": "NumJobs"
						}
					},
					"FileTransferCount": {
						"sum": {
							"field": "FileTransferCount"
						}
					},
					"ByteTransferCount": {
						"sum": {
							"field": "ByteTransferCount"
						}
					},
					"CpuHours": {
						"sum": {
							"field": "CpuHours"
						}
					},
					"GpuHours": {
						"sum": {
							"field": "GpuHours"
						}
					},
					"OSDFFileTransferCount": {
						"sum": {
							"field": "OSDFFileTransferCount"
						}
					},
					"OSDFByteTransferCount": {
						"sum": {
							"field": "OSDFByteTransferCount"
						}
					},
					"CommonFields": {
						"top_hits": {
							"_source": {
								"includes": RESOURCE_COMMON_FIELDS
							},
							"size": 1
						}
					}
				}
			}
		}
	})

	const buckets = usageQueryResult.aggregations.agg.buckets

  return buckets.reduce((p: any, v: any) => {
    p[v['key']] = {
      institutionName: v['key'],
      numJobs: v['NumJobs']['value'],
      cpuHours: v['CpuHours']['value'],
      gpuHours: v['GpuHours']['value'],
      fileTransferCount: v['FileTransferCount']['value'],
      byteTransferCount: v['ByteTransferCount']['value'],
      osdfFileTransferCount: v['OSDFFileTransferCount']['value'],
      osdfByteTransferCount: v['OSDFByteTransferCount']['value'],
      institutionState: getFromCommonField<string>(v, "ResourceInstitution", "state"),
      institutionIpedsWebsiteAddress: getFromCommonField<string>(v, "ResourceInstitution", "ipeds_metadata", "website_address"),
      institutionIpedsHistoricallyBlackCollegeOrUniversity: getFromCommonField<boolean>(v, "ResourceInstitution", "ipeds_metadata", "historically_black_college_or_university"),
      institutionIpedsTribalCollegeOrUniversity: getFromCommonField<boolean>(v, "ResourceInstitution", "ipeds_metadata", "tribal_college_or_university"),
      institutionCarnegieClassification2025: getFromCommonField<string>(v, "ResourceInstitution", "carnegie_metadata", "classification2025"),
      institutionLatitude: getFromCommonField<number>(v, 'ResourceInstitution', 'latitude'),
      institutionLongitude: getFromCommonField<number>(v, 'ResourceInstitution', 'longitude'),
    }
    return p
  }, {})
}

function recurseObject<T>(obj: (object | object[]), ...path: (string | number)[]): T | undefined {
  return path.reduce((o: unknown, key: (string | number)) => {
    if (
      o !== null && o !== undefined && typeof o === 'object' &&
      Object.prototype.hasOwnProperty.call(o, key)
    ) {
      return (o as Record<(string | number), unknown>)[key]
    }
    return undefined
  }, obj) as T
}

function getFromCommonField<T>(data: object, ...field: (string | number)[]): T | undefined {
    const commonKeys: (string | number)[] = ['CommonFields', 'hits', 'hits', 0, '_source']
    return recurseObject<T>(data, ...commonKeys, ...field)
}

const PROJECT_COMMON_FIELDS: string[] = [
	"MajorFieldOfScience",
	"BroadFieldOfScience",
	"DetailedFieldOfScience",
	"ProjectInstitution.name",
  "ProjectInstitution.state",
  "ProjectInstitution.latitude",
  "ProjectInstitution.longitude",
	"ProjectInstitution.ipeds_metadata.website_address",
	"ProjectInstitution.ipeds_metadata.historically_black_college_or_university",
	"ProjectInstitution.ipeds_metadata.tribal_college_or_university",
]

const RESOURCE_COMMON_FIELDS: string[] = [
	"ResourceInstitution.name",
  "ResourceInstitution.state",
  "ResourceInstitution.latitude",
  "ResourceInstitution.longitude",
	"ResourceInstitution.ipeds_metadata.website_address",
	"ResourceInstitution.ipeds_metadata.historically_black_college_or_university",
	"ResourceInstitution.ipeds_metadata.tribal_college_or_university",
  "ResourceInstitution.ipeds_metadata.website_address",
	"ResourceInstitution.carnegie_metadata.classification2025"
]

const EPSCOR_STATES: string[] = [
	"AL", // Alabama
	"AK", // Alaska
	"AR", // Arkansas
	"DE", // Delaware
	"GU", // Guam
	"HI", // Hawaii
	"ID", // Idaho
	"IA", // Iowa
	"KS", // Kansas
	"KY", // Kentucky
	"LA", // Louisiana
	"ME", // Maine
	"MS", // Mississippi
	"MT", // Montana
	"NE", // Nebraska
	"NV", // Nevada
	"NH", // New Hampshire
	"NM", // New Mexico
	"ND", // North Dakota
	"OK", // Oklahoma
	"PR", // Puerto Rico
	"RI", // Rhode Island
	"SC", // South Carolina
	"SD", // South Dakota
	"VI", // U.S. Virgin Islands
	"VT", // Vermont
	"WV", // West Virginia
	"WY"  // Wyoming
];