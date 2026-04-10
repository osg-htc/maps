import { Paper } from '@mui/material';
import { ReactNode } from 'react';

export default function Sidebar({children}: {children: ReactNode}) {
  return (
    <>
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          bottom: 8,
          width: 360 - 16,
          borderRadius: 3,
          overflowY: 'auto',
          m: 1,
          zIndex: 2000
        }}
      >
        { children }
      </Paper>
    </>
  )
}


