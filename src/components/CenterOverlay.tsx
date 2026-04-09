import { Paper, Box } from '@mui/material';
import { ReactNode } from 'react';

export default function CenterOverlay({ children}: {children: ReactNode}) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          m: 1,
          p: 4,
          borderRadius: 3,
          zIndex: 1,
          minWidth: "50vw",
          minHeight: "50vh",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        {children}
      </Paper>
    </Box>
  )
}