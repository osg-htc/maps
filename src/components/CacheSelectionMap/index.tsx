'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Sidebar from "../Sidebar";
import BackButton from "../BackButton";
import { CacheSelection, CacheSelectionData, DirectorServer } from "@/src/utils/director";
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

function getCacheStats(data: CacheSelectionData, selection: CacheSelection): CacheStats[] {
  // Start every cache at zero so the ones that are never chosen are still listed
  const stats: CacheStats[] = data.caches.map(cache => ({ cache, points: CHOICES.map(() => 0), areas: CHOICES.map(() => 0) }))
  data.cells.forEach((cell, i) => {
    selection.choices[i].forEach((cacheIndex, choice) => {
      if (cacheIndex === null) return
      stats[cacheIndex].points[choice] += 1
      stats[cacheIndex].areas[choice] += cell.areaKm2
    })
  })

  return stats.sort((a, b) =>
    b.points[0] - a.points[0] || b.points[1] - a.points[1] || b.points[2] - a.points[2] ||
    a.cache.name.localeCompare(b.cache.name)
  )
}

const formatDate = (date: string) => new Date(date).toLocaleString()

type CacheSelectionMapProps = {
  data: CacheSelectionData
}

export default function CacheSelectionMap({ data }: CacheSelectionMapProps) {
  const [shownChoices, setShownChoices] = useState<number[]>([0])
  // Index into the samples, or "weighted" for all of them combined
  const [shownSample, setShownSample] = useState<string>("weighted")
  const [selectedCacheName, setSelectedCacheName] = useState<string | undefined>()
  const searchParams = useSearchParams();
  const sidebarHiddenSearchParam = searchParams.get('sidebarHidden')

  const sample = shownSample === "weighted" ? undefined : data.samples[Number(shownSample)]
  const selection = sample ?? data.weighted
  const snapshotText = sample || data.samples.length === 1
    ? `Director snapshot from ${formatDate((sample ?? data.samples[0]).generatedAt)}`
    : data.samples.length
      ? `Weighted across ${data.samples.length} director snapshots from ` +
        `${formatDate(data.samples[data.samples.length - 1].generatedAt)} to ${formatDate(data.samples[0].generatedAt)}`
      : ""

  const cacheStats = getCacheStats(data, selection)
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
        selection={selection}
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
                Each region is colored by the OSDF cache the director sends a client in it to first.
                The director was asked about {data.cells.length} evenly spaced locations on land.
                The director&apos;s 2nd choice is drawn as a border inside each region, and its 3rd choice as a dot in the middle.
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
                    {/* A cell drawn the way this choice is shown: filled, bordered or with a dot */}
                    <svg width={16} height={12}>
                      <rect x={0.5} y={0.5} width={15} height={11} fill="none" stroke="currentColor" strokeOpacity={0.3} />
                      {i === 0 && <rect x={0.5} y={0.5} width={15} height={11} fill="currentColor" fillOpacity={0.5} />}
                      {i === 1 && <rect x={1} y={1} width={14} height={10} fill="none" stroke="currentColor" strokeWidth={2} />}
                      {i === 2 && <circle cx={8} cy={6} r={3} fill="currentColor" />}
                    </svg>
                    {choice.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TextField
                select
                fullWidth
                size="small"
                label="Director snapshot"
                value={shownSample}
                onChange={e => setShownSample(e.target.value)}
              >
                <MenuItem value="weighted">All, weighted toward the newest</MenuItem>
                {data.samples.map((x, i) => (
                  <MenuItem key={x.generatedAt} value={String(i)}>{i + 1} · {formatDate(x.generatedAt)}</MenuItem>
                ))}
              </TextField>
              {data.cells.length ?
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
                  {snapshotText}
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
          snapshotText={snapshotText}
          onClose={() => setSelectedCacheName(undefined)}
        />
      }
    </>
  )
}
