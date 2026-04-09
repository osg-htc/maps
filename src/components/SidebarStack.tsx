import { Stack } from '@mui/material';
import { ReactNode } from 'react';

export default function SidebarStack({children}: {children: ReactNode}) {
  return (
    <Stack
      component={'div'}
      spacing={2}
      sx={{
        p: 1,
        pt: 0,
        top: 0,
        left: 0,
        backgroundColor: "#fff",
        boxSizing: 'border-box'
      }}
    >
        { children }
    </Stack>
  )
}

