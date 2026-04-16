import { Card, CardContent, Stack } from '@mui/material';
import { ReactNode } from 'react';

export default function SidebarStack({children}: {children: ReactNode}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflowY: 'auto',
        minHeight: 0,
        flexGrow: 1,
        p: 1,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Stack
          component={'div'}
          spacing={1}
          sx={{
            top: 0,
            left: 0,
            backgroundColor: "#fff",
            boxSizing: 'border-box',

            overflowY: 'auto',
            minHeight: 0,
            flexGrow: 1,
            '& > *': { // targets all children
              flexShrink: 0 
            } 
          }}
        >
          { children }
        </Stack>
      </CardContent>
    </Card>
  )
}

