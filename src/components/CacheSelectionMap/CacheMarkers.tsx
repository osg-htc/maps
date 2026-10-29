'use client';

import { Marker } from "react-map-gl/mapbox";
import { Box } from "@mui/material";
import { Cached } from "@mui/icons-material";
import { DirectorServer } from "@/src/utils/director";
import { CACHE_ICON_COLOR } from "./constants";

type CacheMarkersProps = {
  caches: DirectorServer[]
  colors: Record<string, string>
  selectedCacheName?: string
  onClick: (cache: DirectorServer) => void
}

export default function CacheMarkers({ caches, colors, selectedCacheName, onClick }: CacheMarkersProps) {
  return caches.map(cache => {
    const selected = cache.name === selectedCacheName
    return (
      <Marker
        key={cache.name}
        latitude={cache.latitude}
        longitude={cache.longitude}
        anchor="center"
        style={{ cursor: "pointer", zIndex: selected ? 1 : 0 }}
        onClick={e => {
          e.originalEvent.stopPropagation()
          onClick(cache)
        }}
      >
        <Box
          title={cache.name}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            boxSizing: "border-box",
            borderRadius: "50%",
            backgroundColor: "#000000",
            // Outline in the cache's line color so it can be matched to its lines and cells
            border: `3px solid ${colors[cache.name]}`,
            boxShadow: selected ? "0 0 0 2px #FFFFFF, 0 0 0 4px #000000" : "0 1px 3px rgba(0, 0, 0, 0.4)",
            transform: selected ? "scale(1.25)" : "none",
            transition: "transform 120ms, box-shadow 120ms",
          }}
        >
          <Cached sx={{ color: CACHE_ICON_COLOR, fontSize: 18 }} />
        </Box>
      </Marker>
    )
  })
}
