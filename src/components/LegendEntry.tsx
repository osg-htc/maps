import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

export default function LegendEntry({ icon, text }: { icon: ReactNode, text: string }) { 
  return ( 
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0  // Prevents extra spacing
      }}>
        { icon }
      </Box>
      <Typography variant="subtitle1">{ text }</Typography>
    </Stack>
  )
}