'use client';

import { Layer, Source, useMap } from "react-map-gl/mapbox";
import type { ExpressionSpecification } from "mapbox-gl";
import { useEffect, useState } from "react";
import { CacheSelection, CacheSelectionData, LatLong } from "@/src/utils/director";
import { BORDER_WIDTH, NO_CACHE_COLOR } from "./constants";

const toRadians = (degrees: number) => degrees * Math.PI / 180
const toDegrees = (radians: number) => radians * 180 / Math.PI

/**
 * Points along the great circle between a and b, with longitudes unwrapped
 * so the line stays continuous when it crosses the antimeridian
 */
function greatCircle(a: LatLong, b: LatLong, steps = 64): [number, number][] {
  const [lat1, lon1, lat2, lon2] = [a.latitude, a.longitude, b.latitude, b.longitude].map(toRadians)
  const d = 2 * Math.asin(Math.sqrt(
    Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
  ))

  if (d === 0) {
    return [[a.longitude, a.latitude], [b.longitude, b.latitude]]
  }

  const coordinates: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const f = i / steps
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d) / Math.sin(d)
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2)
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2)
    const z = A * Math.sin(lat1) + B * Math.sin(lat2)

    let longitude = toDegrees(Math.atan2(y, x))
    const latitude = toDegrees(Math.atan2(z, Math.sqrt(x * x + y * y)))

    if (coordinates.length) {
      const previous = coordinates[coordinates.length - 1][0]
      while (longitude - previous > 180) longitude -= 360
      while (longitude - previous < -180) longitude += 360
    }
    coordinates.push([longitude, latitude])
  }
  return coordinates
}

/**
 * The ring wound counterclockwise, so a line offset has the same side of it inside for every cell
 */
function counterClockwise(ring: [number, number][]): [number, number][] {
  // Shoelace formula, positive when counterclockwise. The rings are unwrapped so this works across the antimeridian
  const area = ring.reduce((acc, [x1, y1], i) => {
    const [x2, y2] = ring[(i + 1) % ring.length]
    return acc + x1 * y2 - x2 * y1
  }, 0)
  return area < 0 ? [...ring].reverse() : ring
}

type CacheSelectionLayersProps = {
  data: CacheSelectionData
  selection: CacheSelection
  shownChoices: number[]
  colors: Record<string, string>
  selectedCacheName?: string
}

export default function CacheSelectionLayers({ data, selection, shownChoices, colors, selectedCacheName }: CacheSelectionLayersProps) {

  // Mapbox throws if sources are added before the style finishes loading
  const { current: map } = useMap()
  const [styleLoaded, setStyleLoaded] = useState(false)
  useEffect(() => {
    if (!map) return
    const onLoad = () => setStyleLoaded(true)
    if (map.loaded()) {
      onLoad()
      return
    }
    map.once('idle', onLoad)
    return () => {
      map.off('idle', onLoad)
    }
  }, [map])

  // One line per cluster of touching cells that share their first choice, rather than one per cell
  const lines = {
    type: "FeatureCollection" as const,
    features: selection.clusters.filter(x => x.choice === 0).map(cluster => {
      const cache = data.caches[cluster.cache]
      return {
        type: "Feature" as const,
        properties: { color: colors[cache.name], cache: cache.name },
        geometry: { type: "LineString" as const, coordinates: greatCircle(cluster.center, cache) },
      }
    })
  }

  // Color each cell by the cache the director picks for the given choice
  const cellsFor = (choice: number) => ({
    type: "FeatureCollection" as const,
    features: data.cells.map((x, i) => {
      const cacheIndex = selection.choices[i][choice]
      const cache = cacheIndex === null || cacheIndex === undefined ? undefined : data.caches[cacheIndex]
      return {
        type: "Feature" as const,
        properties: { color: cache ? colors[cache.name] : NO_CACHE_COLOR, cache: cache?.name ?? "" },
        geometry: { type: "Polygon" as const, coordinates: [counterClockwise(x.cell)] },
      }
    })
  })

  // The 3rd choice border sits on the cell's edge when shown, with the 2nd choice border just inside it
  const borders = [1, 2].filter(choice => shownChoices.includes(choice))
  const borderOffset = (choice: number) =>
    -BORDER_WIDTH * (choice === 1 && borders.includes(2) ? 1.5 : 0.5)

  // When a cache is selected, fade out everything that doesn't point to it
  const highlight = (selected: number, other: number, normal: number): ExpressionSpecification | number => selectedCacheName
    ? ["case", ["==", ["get", "cache"], selectedCacheName], selected, other]
    : normal

  if (!styleLoaded) return null

  return (
    <>
      {shownChoices.includes(0) &&
        <Source id="cache-selection-cells" type="geojson" data={cellsFor(0)}>
          <Layer
            id="cache-selection-cells"
            type="fill"
            paint={{ "fill-color": ["get", "color"], "fill-opacity": highlight(0.6, 0.08, 0.35) }}
          />
        </Source>
      }
      {borders.map(choice => (
        <Source key={choice} id={`cache-selection-borders-${choice}`} type="geojson" data={cellsFor(choice)}>
          <Layer
            id={`cache-selection-borders-${choice}`}
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": BORDER_WIDTH,
              // Negative offsets keep the border inside the cell, since the rings are counterclockwise
              "line-offset": borderOffset(choice),
              "line-opacity": highlight(0.95, 0.08, 0.8),
            }}
          />
        </Source>
      ))}
      {shownChoices.includes(0) &&
        <Source id="cache-selection-lines" type="geojson" data={lines}>
          <Layer
            id="cache-selection-lines"
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": 1.5,
              "line-opacity": highlight(0.95, 0.08, 0.7),
            }}
          />
        </Source>
      }
    </>
  )
}
