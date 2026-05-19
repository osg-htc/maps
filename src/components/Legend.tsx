import { Paper, Stack } from '@mui/material';
import { ReactNode } from 'react';

export default function Legend({children, left}: {children: ReactNode, left: number}) {
  return (
    <Paper
      elevation={2}
      sx={{
        position: 'absolute',
        boxSizing: 'border-box',

        left: left + 16,
        bottom: 16,
        borderRadius: 3,
        p: 2,

        zIndex: 9100,
      }}
    >
      <Stack spacing={0.5}>
        { children }
      </Stack>
    </Paper>
  )
}


