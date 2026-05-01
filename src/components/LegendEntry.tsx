import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

export default function LegendEntry({ icon, text }: { icon: ReactNode, text: string }) { 

  return ( 
    <Stack direction="row" alignItems="center" spacing={0}>
      <Box width={30} height={40} sx={{ display: 'flex', justifyContent: 'center'}}>
        { icon }
      </Box>
      <Typography variant="subtitle1">{ text }</Typography>
    </Stack>
  )
}