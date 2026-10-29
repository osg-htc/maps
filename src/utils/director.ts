/**
 * Queries the OSDF director to find which caches it picks for clients around the globe
 *
 * The director only accepts a client coordinate through the X-Pelican-Coordinate header,
 * which browsers are blocked from sending by CORS, so this runs at build time.
 */

import { geoArea, geoContains } from "d3-geo";
import { geoDelaunay, geoVoronoi } from "d3-geo-voronoi";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-50m.json";

const DIRECTOR_URL = "https://osdf-director.osg-htc.org"
const DIRECTOR_TEST_OBJECT = "/pelicanplatform/test/hello-world.txt"
const EARTH_RADIUS_KM = 6371.0088

export type LatLong = {
  latitude: number
  longitude: number
}

export type DirectorServer = {
  name: string
  url: string
  webUrl: string
  type: "Origin" | "Cache"
  latitude: number
  longitude: number
  healthStatus: string
  serverStatus: string
  version: string
  ioLoad: number
  filtered: boolean
  filteredType: string
  namespacePrefixes: string[]
}

type LandCell = {
  // Position of this point in the full globe grid
  index: number
  point: LatLong
  // The part of the globe closest to this point, as an unwrapped [longitude, latitude] ring
  cell: [number, number][]
  areaKm2: number
}

export type CacheCell = Omit<LandCell, "index" | "point"> & {
  // Index into the caches list for each of the director's choices in priority order,
  // null where the director picked a host that isn't a known cache
  choices: (number | null)[]
}

export type CacheCluster = {
  choice: number
  cache: number
  // A grid point near the middle of the cluster, its line to the cache is drawn from here
  center: LatLong
}

export type CacheSelectionData = {
  caches: DirectorServer[]
  cells: CacheCell[]
  // Touching cells that share a cache for a given choice, so one line can stand in for many
  clusters: CacheCluster[]
}

async function getDirectorServers(): Promise<DirectorServer[]> {
  const response = await fetch(`${DIRECTOR_URL}/api/v1.0/director_ui/servers`)
  if (!response.ok) {
    throw new Error(`Failed to fetch director servers: ${response.status}`)
  }
  const data = await response.json() as DirectorServer[]

  // Keep only what the map needs so the page payload stays small
  return data.map(server => ({
    name: server.name,
    url: server.url,
    webUrl: server.webUrl,
    type: server.type,
    latitude: server.latitude,
    longitude: server.longitude,
    healthStatus: server.healthStatus,
    serverStatus: server.serverStatus,
    version: server.version,
    ioLoad: server.ioLoad,
    filtered: server.filtered,
    filteredType: server.filteredType,
    namespacePrefixes: [...new Set(server.namespacePrefixes ?? [])].sort(),
  }))
}

/**
 * Roughly equidistant points covering the globe, using a Fibonacci lattice
 */
export function getGlobeGrid(count: number): LatLong[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  return [...Array(count).keys()].map(i => {
    const y = 1 - (2 * (i + 0.5)) / count
    return {
      latitude: Math.asin(y) * 180 / Math.PI,
      longitude: ((i * goldenAngle * 180 / Math.PI) % 360) - 180,
    }
  })
}

/**
 * Unwrap a cell's longitudes around its site so it draws as one shape on the map,
 * closing it over the pole when the cell surrounds one
 */
function unwrapRing(ring: number[][], site: LatLong): [number, number][] {
  let previous = site.longitude
  const unwrapped = ring.map(([longitude, latitude]) => {
    while (longitude - previous > 180) longitude -= 360
    while (longitude - previous < -180) longitude += 360
    previous = longitude
    return [longitude, latitude] as [number, number]
  })

  const first = unwrapped[0]
  const last = unwrapped[unwrapped.length - 1]
  if (Math.abs(last[0] - first[0]) > 180) {
    const pole = site.latitude > 0 ? 90 : -90
    unwrapped.push([last[0], pole], [first[0], pole], first)
  }
  return unwrapped
}

// Rounds to about 100m to keep the page payload small
const round = (x: number) => Math.round(x * 1000) / 1000

/**
 * Grid points that fall on land, each with the area of the globe closest to it,
 * plus which grid points neighbor each other.
 * Cells are built from the whole grid so coastal cells don't spill out over the ocean.
 */
export function getLandGrid(count: number): { cells: LandCell[], neighbors: number[][] } {
  const land = feature(landTopology as unknown as Parameters<typeof feature>[0], "land")
  const points = getGlobeGrid(count)
  const coordinates = points.map(x => [x.longitude, x.latitude] as [number, number])
  const polygons = geoVoronoi(coordinates).polygons().features

  const cells = polygons.flatMap((polygon, index) => {
    const point = points[index]
    if (!geoContains(land, [point.longitude, point.latitude])) return []
    return [{
      index,
      point,
      cell: unwrapRing(polygon.geometry.coordinates[0], point).map(([lon, lat]) => [round(lon), round(lat)] as [number, number]),
      areaKm2: Math.round(geoArea(polygon) * EARTH_RADIUS_KM ** 2),
    }]
  })

  return { cells, neighbors: geoDelaunay(coordinates).neighbors }
}

const toVector = ({ latitude, longitude }: LatLong) => {
  const [lat, lon] = [latitude, longitude].map(x => x * Math.PI / 180)
  return [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)]
}

/**
 * Group touching cells that the director sends to the same cache for each choice
 */
function clusterCells(cells: LandCell[], choices: (number | null)[][], neighbors: number[][], choiceCount: number): CacheCluster[] {
  const positionByIndex = new Map(cells.map((cell, position) => [cell.index, position]))
  const clusters: CacheCluster[] = []

  for (let choice = 0; choice < choiceCount; choice++) {
    const visited = new Set<number>()

    cells.forEach((_, start) => {
      const cache = choices[start][choice]
      if (cache === null || cache === undefined || visited.has(start)) return

      // Flood fill across neighboring land cells with the same cache
      const members: number[] = []
      const queue = [start]
      visited.add(start)
      while (queue.length) {
        const position = queue.pop()!
        members.push(position)
        for (const neighbor of neighbors[cells[position].index] ?? []) {
          const next = positionByIndex.get(neighbor)
          if (next === undefined || visited.has(next) || choices[next][choice] !== cache) continue
          visited.add(next)
          queue.push(next)
        }
      }

      // Use the member closest to the area weighted middle, so the line starts inside the cluster
      const middle = [0, 0, 0]
      for (const position of members) {
        toVector(cells[position].point).forEach((v, axis) => middle[axis] += v * cells[position].areaKm2)
      }
      const center = members.reduce((best, position) => {
        const dot = (p: number) => toVector(cells[p].point).reduce((acc, v, axis) => acc + v * middle[axis], 0)
        return dot(position) > dot(best) ? position : best
      })

      const { latitude, longitude } = cells[center].point
      clusters.push({ choice, cache, center: { latitude: round(latitude), longitude: round(longitude) } })
    })
  }

  return clusters
}

/**
 * Ask the director which caches it would redirect a client at this location to,
 * in priority order, using the Link header of the redirect
 */
async function getSelectedCacheHosts(point: LatLong): Promise<string[]> {
  try {
    const response = await fetch(`${DIRECTOR_URL}/api/v1.0/director/object${DIRECTOR_TEST_OBJECT}`, {
      method: "HEAD",
      redirect: "manual",
      headers: { "X-Pelican-Coordinate": `lat=${point.latitude},long=${point.longitude}` },
    })
    const link = response.headers.get("link") ?? ""

    // Each entry looks like <https://host:port/path>; rel="duplicate"; pri=1; depth=2
    return [...link.matchAll(/<([^>]+)>[^,]*?pri=(\d+)/g)]
      .sort((a, b) => Number(a[2]) - Number(b[2]))
      .map(match => new URL(match[1]).host)
  } catch {
    return []
  }
}

export async function getCacheSelectionData(pointCount: number, choiceCount = 3, concurrency = 10): Promise<CacheSelectionData> {
  const servers = await getDirectorServers()

  // List every cache, including ones the director never picks, and refer to them by index
  const caches = servers.filter(server => server.type === "Cache")
  const cacheIndexByHost = new Map(caches.map((cache, i) => [new URL(cache.url).host, i]))

  const { cells, neighbors } = getLandGrid(pointCount)

  // Work through the grid in small batches to be gentle on the director
  const hostLists: string[][] = []
  for (let i = 0; i < cells.length; i += concurrency) {
    const batch = cells.slice(i, i + concurrency)
    hostLists.push(...await Promise.all(batch.map(x => getSelectedCacheHosts(x.point))))
  }

  const choices = hostLists.map(hosts => hosts.slice(0, choiceCount).map(host => cacheIndexByHost.get(host) ?? null))

  // Drop cells the director gave no answer for
  const answered = cells.map((_, i) => i).filter(i => hostLists[i].length)
  const answeredCells = answered.map(i => cells[i])
  const answeredChoices = answered.map(i => choices[i])

  return {
    caches,
    cells: answeredCells.map(({ cell, areaKm2 }, i) => ({ cell, areaKm2, choices: answeredChoices[i] })),
    clusters: clusterCells(answeredCells, answeredChoices, neighbors, choiceCount),
  }
}
