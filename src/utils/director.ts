/**
 * Queries the OSDF director to find which caches it picks for clients around the globe
 *
 * The director only accepts a client coordinate through the X-Pelican-Coordinate header,
 * which browsers are blocked from sending by CORS, so this runs at build time.
 */

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { geoArea, geoContains } from "d3-geo";
import { geoVoronoi } from "d3-geo-voronoi";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-50m.json";

const DIRECTOR_URL = "https://osdf-director.osg-htc.org"
const DIRECTOR_TEST_OBJECT = "/pelicanplatform/test/hello-world.txt"
const EARTH_RADIUS_KM = 6371.0088

// Saves director responses to disk so repeated runs don't hammer the director, and so the map
// can show a history of them. On by default in `next dev`, set DIRECTOR_CACHE=true to use it
// for `next build` too. Delete the file to start the history over.
const DIRECTOR_CACHE_FILE = path.join(process.cwd(), ".cache", "director.json")
const DIRECTOR_CACHE_ENABLED = process.env.DIRECTOR_CACHE
  ? process.env.DIRECTOR_CACHE === "true"
  : process.env.NODE_ENV === "development"

// A new snapshot is taken once the latest is this old, until then its missing locations are filled in
const SNAPSHOT_MAX_AGE_MS = 5 * 60 * 60 * 1000
const SNAPSHOT_COUNT = 10
// How much more the newest snapshot counts than the oldest in the weighted view
const NEWEST_SNAPSHOT_WEIGHT = 10

type DirectorSnapshot = {
  createdAt: string
  servers: DirectorServer[]
  // Selected cache hosts keyed by "latitude,longitude"
  hosts: Record<string, string[]>
}

type DirectorCache = {
  // Newest first
  snapshots: DirectorSnapshot[]
}

async function readDirectorCache(): Promise<DirectorCache> {
  if (!DIRECTOR_CACHE_ENABLED) return { snapshots: [] }
  try {
    const cache = JSON.parse(await readFile(DIRECTOR_CACHE_FILE, "utf8")) as Partial<DirectorCache>
    // Files from before snapshots were kept are dropped
    return { snapshots: cache.snapshots ?? [] }
  } catch {
    return { snapshots: [] }
  }
}

async function writeDirectorCache(cache: DirectorCache) {
  if (!DIRECTOR_CACHE_ENABLED) return
  await mkdir(path.dirname(DIRECTOR_CACHE_FILE), { recursive: true })
  await writeFile(DIRECTOR_CACHE_FILE, JSON.stringify(cache))
}

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
  point: LatLong
  // The part of the globe closest to this point, as an unwrapped [longitude, latitude] ring
  cell: [number, number][]
  areaKm2: number
}

export type CacheCell = Omit<LandCell, "point"> & {
  // The grid point the cell is built around, as [longitude, latitude]
  center: [number, number]
}

export type CacheSelection = {
  // For each cell, an index into the caches list for each of the director's choices in priority order,
  // null where the director picked a host that isn't a known cache, empty where it gave no answer
  choices: (number | null)[][]
}

export type CacheSelectionSample = CacheSelection & {
  generatedAt: string
}

export type CacheSelectionData = {
  caches: DirectorServer[]
  cells: CacheCell[]
  // Each director snapshot, newest first
  samples: CacheSelectionSample[]
  // All the samples combined, with newer ones counting for more
  weighted: CacheSelection
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
 * Grid points that fall on land, each with the area of the globe closest to it.
 * Cells are built from the whole grid so coastal cells don't spill out over the ocean.
 */
export function getLandGrid(count: number): LandCell[] {
  const land = feature(landTopology as unknown as Parameters<typeof feature>[0], "land")
  const points = getGlobeGrid(count)
  const coordinates = points.map(x => [x.longitude, x.latitude] as [number, number])
  const polygons = geoVoronoi(coordinates).polygons().features

  return polygons.flatMap((polygon, index) => {
    const point = points[index]
    if (!geoContains(land, [point.longitude, point.latitude])) return []
    return [{
      point,
      cell: unwrapRing(polygon.geometry.coordinates[0], point).map(([lon, lat]) => [round(lon), round(lat)] as [number, number]),
      areaKm2: Math.round(geoArea(polygon) * EARTH_RADIUS_KM ** 2),
    }]
  })
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

/**
 * Combine one cell's choices from several samples, picking for each choice in turn the cache
 * with the most weight that isn't already an earlier choice. Ties go to the earlier sample.
 */
function weightChoices(samples: (number | null)[][], weights: number[], choiceCount: number): (number | null)[] {
  const picked: (number | null)[] = []
  for (let choice = 0; choice < choiceCount; choice++) {
    const totals = new Map<number | null, number>()
    samples.forEach((choices, i) => {
      if (choice >= choices.length) return
      const cache = choices[choice]
      if (cache !== null && picked.includes(cache)) return
      totals.set(cache, (totals.get(cache) ?? 0) + weights[i])
    })
    if (!totals.size) break

    let best: [number | null, number] = [null, -Infinity]
    for (const total of totals) {
      if (total[1] > best[1]) best = total
    }
    picked.push(best[0])
  }
  return picked
}

export async function getCacheSelectionData(pointCount: number, choiceCount = 3, concurrency = 10): Promise<CacheSelectionData> {
  const directorCache = await readDirectorCache()

  // Start a new snapshot once the latest is too old, dropping the oldest past the limit
  const latest = directorCache.snapshots[0]
  if (!latest || Date.now() - new Date(latest.createdAt).getTime() > SNAPSHOT_MAX_AGE_MS) {
    directorCache.snapshots.unshift({ createdAt: new Date().toISOString(), servers: await getDirectorServers(), hosts: {} })
    directorCache.snapshots = directorCache.snapshots.slice(0, SNAPSHOT_COUNT)
  }
  const { snapshots } = directorCache
  const current = snapshots[0]

  const cells = getLandGrid(pointCount)

  // Work through the grid in small batches to be gentle on the director
  let lastPercent = 0
  for (let i = 0; i < cells.length; i += concurrency) {
    const batch = cells.slice(i, i + concurrency)
    await Promise.all(batch.map(async x => {
      const key = `${x.point.latitude},${x.point.longitude}`
      if (current.hosts[key]) return
      const hosts = await getSelectedCacheHosts(x.point)
      // Leave failed lookups out so they are retried next time
      if (hosts.length) current.hosts[key] = hosts
    }))

    // Log progress every 5% since this takes a while during the build
    const done = Math.min(i + concurrency, cells.length)
    const percent = Math.floor(done / cells.length * 20) * 5
    if (percent > lastPercent) {
      lastPercent = percent
      console.log(`Cache selection: queried director for ${done}/${cells.length} locations (${percent}%)`)
    }
  }

  await writeDirectorCache(directorCache)

  // List every cache from any snapshot, including ones the director never picks, and refer to them by index.
  // Newer snapshots come first so a cache is shown as it was most recently.
  const caches = [...new Map(
    snapshots.flatMap(x => x.servers).filter(x => x.type === "Cache").reverse().map(x => [x.name, x])
  ).values()].reverse()
  const cacheIndexByHost = new Map(caches.map((cache, i) => [new URL(cache.url).host, i]))

  const keys = cells.map(x => `${x.point.latitude},${x.point.longitude}`)
  const sampleChoices = snapshots.map(snapshot => keys.map(key =>
    (snapshot.hosts[key] ?? []).slice(0, choiceCount).map(host => cacheIndexByHost.get(host) ?? null)
  ))

  // Drop cells no snapshot has an answer for
  const answered = cells.map((_, i) => i).filter(i => sampleChoices.some(choices => choices[i].length))

  // Newest counts NEWEST_SNAPSHOT_WEIGHT times the oldest, scaling linearly between them
  const weights = snapshots.map((_, i) =>
    snapshots.length === 1 ? 1 : NEWEST_SNAPSHOT_WEIGHT - (NEWEST_SNAPSHOT_WEIGHT - 1) * i / (snapshots.length - 1)
  )
  const weightedChoices = answered.map(i => weightChoices(sampleChoices.map(choices => choices[i]), weights, choiceCount))

  return {
    caches,
    cells: answered.map(i => cells[i]).map(({ point, cell, areaKm2 }) => ({
      center: [round(point.longitude), round(point.latitude)] as [number, number],
      cell,
      areaKm2,
    })),
    samples: snapshots.map((snapshot, s) => ({
      generatedAt: snapshot.createdAt,
      choices: answered.map(i => sampleChoices[s][i]),
    })),
    weighted: { choices: weightedChoices },
  }
}
