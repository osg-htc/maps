'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Sidebar from "../Sidebar";
import BackButton from "../BackButton";
import { CacheSelectionData, DirectorServer } from "@/src/utils/director";
import CacheSelectionLayers from "./CacheSelectionLayers";
import CacheMarkers from "./CacheMarkers";
import CacheListCard from "./CacheListCard";
import CacheDetails from "./CacheDetails";
import { CHOICES, PALETTE } from "./constants";

export type CacheStats = {
  cache: DirectorServer
  // Number of locations and land area that pick this cache, indexed by choice
  points: number[]
  areas: number[]
}

function getCacheStats(data: CacheSelectionData): CacheStats[] {
  const stats: Record<number, CacheStats> = {}
  for (const cell of data.cells) {
    cell.choices.forEach((cacheIndex, choice) => {
      if (cacheIndex === null) return
      stats[cacheIndex] ??= { cache: data.caches[cacheIndex], points: CHOICES.map(() => 0), areas: CHOICES.map(() => 0) }
      stats[cacheIndex].points[choice] += 1
      stats[cacheIndex].areas[choice] += cell.areaKm2
    })
  }

  return Object.values(stats).sort((a, b) =>
    b.points[0] - a.points[0] || b.points[1] - a.points[1] || b.points[2] - a.points[2]
  )
}

type CacheSelectionMapProps = {
  data: CacheSelectionData
  generatedAt: string
}

export default function CacheSelectionMap({ data, generatedAt }: CacheSelectionMapProps) {
  const [shownChoices, setShownChoices] = useState<number[]>([0])
  const [selectedCacheName, setSelectedCacheName] = useState<string | undefined>()
  const searchParams = useSearchParams();
  const sidebarHiddenSearchParam = searchParams.get('sidebarHidden')

  const cacheStats = getCacheStats(data)
  const landArea = data.cells.reduce((acc, x) => acc + x.areaKm2, 0)
  const selectedStats = cacheStats.find(x => x.cache.name === selectedCacheName)

  // Assign colors by name so a cache keeps its color however the list is sorted
  const colors: Record<string, string> = Object.fromEntries(
    cacheStats.map(x => x.cache.name).sort().map((name, i) => [name, PALETTE[i % PALETTE.length]])
  )

  // Only mark the caches picked by a shown choice, plus the selected one
  const shownCaches = cacheStats
    .filter(x => x.cache.name === selectedCacheName || shownChoices.some(choice => x.points[choice] > 0))
    .map(x => x.cache)

  const toggleCache = (name: string) => setSelectedCacheName(name === selectedCacheName ? undefined : name)

  return (
    <>
      <CacheSelectionLayers
        data={data}
        shownChoices={shownChoices}
        colors={colors}
        selectedCacheName={selectedCacheName}
      />
      <CacheMarkers
        caches={shownCaches}
        colors={colors}
        selectedCacheName={selectedCacheName}
        onClick={cache => toggleCache(cache.name)}
      />

      {sidebarHiddenSearchParam ? <></> :
        <Sidebar
          leftButton={<BackButton link={"../"} />}
          header={<Typography variant="h5" align="center">Cache Selection</Typography>}
          body={
            <>
              <Typography variant="body2" color="secondary.main">
                Each region is colored by the OSDF cache the director sends a client in it to.
                The director was asked about {data.cells.length} evenly spaced locations on land.
                Each line joins a group of touching regions to the cache they share.
              </Typography>
              <ToggleButtonGroup
                fullWidth
                size="small"
                value={shownChoices}
                aria-label="Director choices to show"
                onChange={(_, value: number[]) => {
                  // Always keep at least one choice visible
                  if (value.length) setShownChoices(value)
                }}
              >
                {CHOICES.map((choice, i) => (
                  <ToggleButton key={choice.label} value={i} sx={{ gap: 1 }}>
                    <svg width={20} height={4}>
                      <line x1={0} y1={2} x2={20} y2={2} stroke="currentColor" strokeWidth={2} strokeDasharray={choice.dasharray.map(x => x * 2).join(' ')} />
                    </svg>
                    {choice.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {cacheStats.length ?
                cacheStats.map(stats =>
                  <CacheListCard
                    key={stats.cache.name}
                    stats={stats}
                    color={colors[stats.cache.name]}
                    onClick={() => toggleCache(stats.cache.name)}
                  />
                )
                :
                <Typography variant="body2" color="error.main">
                  The director could not be reached when this page was built.
                </Typography>
              }
              <Stack>
                <Typography align="center" variant="subtitle2" fontStyle="italic">
                  Director snapshot from {new Date(generatedAt).toLocaleString()}
                </Typography>
              </Stack>
            </>
          }
        />
      }

      {selectedStats &&
        <CacheDetails
          stats={selectedStats}
          landArea={landArea}
          color={colors[selectedStats.cache.name]}
          generatedAt={generatedAt}
          onClose={() => setSelectedCacheName(undefined)}
        />
      }
    </>
  )
}
