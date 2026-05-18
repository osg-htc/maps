import { Paper, Stack } from '@mui/material';
import { ReactNode } from 'react';

export default function LogoContainer({children}: {children: ReactNode}) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'absolute',
        boxSizing: 'border-box',

        right: 16,
        bottom: 16,
        borderRadius: 3,
        p: 2,

        zIndex: 9100,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        {children}
      </Stack>
    </Paper>
  )
}


