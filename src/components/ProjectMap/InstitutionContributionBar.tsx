import { Box } from '@mui/material';

export default function InstitutionContributionBar({ backgroundColor, height, width }: { backgroundColor: string, height: number, width: number }) {
  return (
    <Box sx={{
      position: 'relative',
      border: '2px solid black',
      backgroundColor: backgroundColor,
      width: width,
      height: height,
    }} />
  )
}
