import CacheSelectionMap from "@/src/components/CacheSelectionMap";
import { CacheSelectionData, getCacheSelectionData } from "@/src/utils/director";

// Number of equidistant points covering the globe, only those on land are queried
const GRID_POINT_COUNT = 9000

export default async function CacheSelectionPage() {
  // Don't fail the whole site build if the director is down, the page shows an error instead
  let data: CacheSelectionData = { caches: [], cells: [], clusters: [] }
  try {
    data = await getCacheSelectionData(GRID_POINT_COUNT)
  } catch (error) {
    console.error("Failed to query the director for cache selections", error)
  }

  return (
    <CacheSelectionMap data={data} generatedAt={new Date().toISOString()} />
  );
}
