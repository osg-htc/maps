import { LocationPin, Circle } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export default function MapPin({ color, size, children }: { 
  color: string, 
  size: number, 
  children?: ReactNode
}) {
  return (
    <Box sx={{ 
      position: 'relative', 
      display: 'inline-block',
      lineHeight: 0  // Removes inline spacing
    }}>
      <LocationPin sx={{ 
        color: color, 
        fontSize: size,
        display: 'block'  // Removes inline gap
      }} />
      <Circle sx={{ 
        color: color, 
        fontSize: size / 4, 
        position: "absolute", 
        top: "38.5%", 
        left: "50%", 
        transform: "translate(-50%, -50%)" 
      }} />
      <Box sx={{
        position: "absolute", 
        top: "38.5%", 
        left: "50%", 
        transform: "translate(-50%, -50%)" 
      }}>
        {children}
      </Box>
    </Box>
  );
}