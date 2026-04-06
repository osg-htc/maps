import { Paper } from '@mui/material';
import { ReactNode } from 'react';

function Sidebar({width, children}: {width: number, children: ReactNode}) {
  return width > 0 ? (
    <>
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          bottom: 8,
          width: width - 16,
          zIndex: 1,
          borderRadius: 3,
          overflowY: 'auto',
          m: 1,
        }}
      >
        { children }
      </Paper>
    </>
  ) : (<></>)
}

export default Sidebar;
