import { Box, Chip, Stack, Typography } from '@mui/material';
import ListCardBase from '../ListCardBase';
import { addSpacesToUnderscores } from '@/src/utils/helpers';
import type { CacheStats } from '.';
import { statusColor } from './constants';

export default function CacheListCard({ stats, color, onClick }: { stats: CacheStats, color: string, onClick: () => void }) {
  const { cache } = stats

  return (
    <ListCardBase onClick={onClick}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0, bgcolor: color }} />
        <Typography color="secondary.main" variant="body1" lineHeight={1.2} sx={{ flexGrow: 1, minWidth: 0 }}>
          {addSpacesToUnderscores(cache.name)}
        </Typography>
        <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
          <Typography color="primary.main" variant="body1" lineHeight={1.2}>{stats.points[0]}</Typography>
          <Typography color="text.secondary" variant="caption" lineHeight={1}>1st choice</Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1, pl: 3.25, flexWrap: "wrap", rowGap: 0.5 }}>
        <Chip size="small" label={`Health: ${cache.healthStatus}`} color={statusColor(cache.healthStatus)} />
        <Chip size="small" label={`Status: ${cache.serverStatus}`} color={statusColor(cache.serverStatus)} variant="outlined" />
        <Typography color="text.secondary" variant="caption" sx={{ ml: "auto !important" }}>
          IO load {cache.ioLoad.toFixed(2)}
        </Typography>
      </Stack>
    </ListCardBase>
  )
}
