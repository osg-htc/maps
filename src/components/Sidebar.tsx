import { Paper } from '@mui/material';
import { ReactNode } from 'react';

export default function Sidebar({children}: {children: ReactNode}) {
  return (
    <Paper
      elevation={2}
      sx={{
        position: 'absolute',
        boxSizing: 'border-box',

        top: 16,
        left: 16,
        bottom: 16,
        width: 400 - 16,
        borderRadius: 3,
        p: 2,

        zIndex: 2000,

        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      { children }
    </Paper>
  )
}


