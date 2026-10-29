'use client';

import { Layer, Source, useMap } from "react-map-gl/mapbox";
import type { ExpressionSpecification } from "mapbox-gl";
import { useEffect, useState } from "react";
import { CacheSelection, CacheSelectionData } from "@/src/utils/director";
import { BORDER_WIDTH, DOT_RADIUS, NO_CACHE_COLOR } from "./constants";

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

  const propertiesFor = (cellIndex: number, choice: number) => {
    const cacheIndex = selection.choices[cellIndex][choice]
    const cache = cacheIndex === null || cacheIndex === undefined ? undefined : data.caches[cacheIndex]
    return { color: cache ? colors[cache.name] : NO_CACHE_COLOR, cache: cache?.name ?? "" }
  }

  // Each cell colored by the cache the director picks for the given choice
  const cellsFor = (choice: number) => ({
    type: "FeatureCollection" as const,
    features: data.cells.map((x, i) => ({
      type: "Feature" as const,
      properties: propertiesFor(i, choice),
      geometry: { type: "Polygon" as const, coordinates: [counterClockwise(x.cell)] },
    }))
  })

  // A dot in the middle of each cell colored by the cache the director picks for the given choice
  const dotsFor = (choice: number) => ({
    type: "FeatureCollection" as const,
    features: data.cells.map((x, i) => ({
      type: "Feature" as const,
      properties: propertiesFor(i, choice),
      geometry: { type: "Point" as const, coordinates: x.center },
    }))
  })

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
      {shownChoices.includes(1) &&
        <Source id="cache-selection-borders" type="geojson" data={cellsFor(1)}>
          <Layer
            id="cache-selection-borders"
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": BORDER_WIDTH,
              // A negative offset keeps the border inside the cell, since the rings are counterclockwise
              "line-offset": -BORDER_WIDTH / 2,
              "line-opacity": highlight(0.95, 0.08, 0.8),
            }}
          />
        </Source>
      }
      {shownChoices.includes(2) &&
        <Source id="cache-selection-dots" type="geojson" data={dotsFor(2)}>
          <Layer
            id="cache-selection-dots"
            type="circle"
            paint={{
              "circle-color": ["get", "color"],
              "circle-radius": DOT_RADIUS,
              "circle-opacity": highlight(1, 0.08, 0.9),
            }}
          />
        </Source>
      }
    </>
  )
}
