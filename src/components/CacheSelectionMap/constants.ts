// The director's choices in priority order. The 1st fills each cell and has lines to its cache,
// the 2nd is a border just inside the cell and the 3rd a border around that one.
export const CHOICES = [
  { label: "1st" },
  { label: "2nd" },
  { label: "3rd" },
]

// Width in pixels of each border drawn inside a cell
export const BORDER_WIDTH = 2

export const PALETTE = [
  "#E6194B", "#3CB44B", "#4363D8", "#F58231", "#911EB4", "#42D4F4", "#F032E6", "#BFEF45",
  "#FABED4", "#469990", "#DCBEFF", "#9A6324", "#800000", "#AAFFC3", "#808000", "#000075",
  "#FFE119", "#FFD8B1", "#00A86B", "#C71585", "#2F4F4F", "#BC8F8F", "#4B0082", "#FF4500",
]

export const CACHE_ICON_COLOR = "#FF7B00"

export const NO_CACHE_COLOR = "#888888"

export function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "ok": return "success"
    case "error":
    case "critical": return "error"
    default: return "warning"
  }
}
