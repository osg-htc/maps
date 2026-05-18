import { Box, } from "@mui/material";
import { ReactNode } from "react";

export default function SidebarHeader({children}: {children: ReactNode}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '40px auto 40px',
        alignItems: 'top',
        mb: 1
      }}
    >
      { children }
    </Box>
  );
}