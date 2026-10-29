'use client';

import { Layer, Source, useMap } from "react-map-gl/mapbox";
import type { ExpressionSpecification } from "mapbox-gl";
import { useEffect, useState } from "react";
import { CacheSelectionData, LatLong } from "@/src/utils/director";
import { CHOICES, NO_CACHE_COLOR } from "./constants";

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

type CacheSelectionLayersProps = {
  data: CacheSelectionData
  shownChoices: number[]
  colors: Record<string, string>
  selectedCacheName?: string
}

export default function CacheSelectionLayers({ data, shownChoices, colors, selectedCacheName }: CacheSelectionLayersProps) {

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

  // One line per cluster of touching cells that share a cache, rather than one per cell
  const linesFor = (choice: number) => ({
    type: "FeatureCollection" as const,
    features: data.clusters.filter(x => x.choice === choice).map(cluster => {
      const cache = data.caches[cluster.cache]
      return {
        type: "Feature" as const,
        properties: { color: colors[cache.name], cache: cache.name },
        geometry: { type: "LineString" as const, coordinates: greatCircle(cluster.center, cache) },
      }
    })
  })

  // Color each cell by the highest priority choice currently shown
  const firstShown = Math.min(...shownChoices)
  const cells = {
    type: "FeatureCollection" as const,
    features: data.cells.map(x => {
      const cacheIndex = x.choices[firstShown]
      const cache = cacheIndex === null || cacheIndex === undefined ? undefined : data.caches[cacheIndex]
      return {
        type: "Feature" as const,
        properties: { color: cache ? colors[cache.name] : NO_CACHE_COLOR, cache: cache?.name ?? "" },
        geometry: { type: "Polygon" as const, coordinates: [x.cell] },
      }
    })
  }

  // When a cache is selected, fade out everything that doesn't point to it
  const highlight = (selected: number, other: number, normal: number): ExpressionSpecification | number => selectedCacheName
    ? ["case", ["==", ["get", "cache"], selectedCacheName], selected, other]
    : normal

  if (!styleLoaded) return null

  return (
    <>
      <Source id="cache-selection-cells" type="geojson" data={cells}>
        <Layer
          id="cache-selection-cells"
          type="fill"
          paint={{ "fill-color": ["get", "color"], "fill-opacity": highlight(0.6, 0.08, 0.35) }}
        />
      </Source>
      {/* Draw lower priority choices first so the top choice sits on top */}
      {[...shownChoices].sort((a, b) => b - a).map(choice => (
        <Source key={choice} id={`cache-selection-lines-${choice}`} type="geojson" data={linesFor(choice)}>
          <Layer
            id={`cache-selection-lines-${choice}`}
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": 1.5,
              "line-opacity": highlight(0.95, 0.08, 0.7),
              "line-dasharray": CHOICES[choice].dasharray,
            }}
          />
        </Source>
      ))}
    </>
  )
}
