import { Paper } from '@mui/material';
import { ReactNode } from 'react';

export default function Legend({children}: {children: ReactNode}) {
  return (
    <Paper
      elevation={2}
      sx={{
        position: 'absolute',
        boxSizing: 'border-box',

        left: 400 + 16,
        bottom: 16,
        borderRadius: 3,
        p: 2,

        zIndex: 2000,
      }}
    >
      { children }
    </Paper>
  )
}


