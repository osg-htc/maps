import { LocationPin, Circle } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

export default function InstitutionContributionBar({ color, size, text }: { color: string, size: number, text?: string }) {
  return (
    <>
      <Box sx={{ position: 'relative', width: 'fit-content' }}>
        <LocationPin sx={{ // location pin has a hole in the top that we dont want...
          color: color,
          fontSize: size,
        }} />
        <Circle sx={{ // ...so we just fill it with a circle
          color: color,
          fontSize: size / 2,
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }} />
      </Box>
      <Typography sx={{
        color: "white",
        fontSize: size / 2,
        position: "absolute",
        top: "35%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}>
        {text}
      </Typography>
    </>
  )
}
