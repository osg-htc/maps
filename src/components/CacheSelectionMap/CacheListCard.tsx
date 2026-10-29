import { Box, Stack, Typography } from '@mui/material';
import ListCardBase from '../ListCardBase';
import { addSpacesToUnderscores } from '@/src/utils/helpers';
import type { CacheStats } from '.';

export default function CacheListCard({ stats, color, onClick }: { stats: CacheStats, color: string, onClick: () => void }) {
  return (
    <ListCardBase onClick={onClick}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0, bgcolor: color }} />
        <Typography color="secondary.main" variant="body1" lineHeight={1.2} sx={{ flexGrow: 1, minWidth: 0 }}>
          {addSpacesToUnderscores(stats.cache.name)}
        </Typography>
        <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
          <Typography color="primary.main" variant="body1" lineHeight={1.2}>{stats.points[0]}</Typography>
          <Typography color="text.secondary" variant="caption" lineHeight={1}>1st choice</Typography>
        </Stack>
      </Stack>
    </ListCardBase>
  )
}
