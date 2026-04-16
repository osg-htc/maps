import { ProjectData } from '@/src/utils/adstash';
import { Typography, Stack, Card, CardContent, CardActionArea, Divider, Grid, Chip, Tooltip, Box } from '@mui/material';
import { addSpacesToUnderscores, formatNumber } from '@/src/utils/formatters';
import { ProjectPinProps } from './ProjectPins';

export default function InsitutionListCard({ institution }: {institution: ProjectPinProps } ) {
  return (
    <Card
      key={institution.name}
      variant="outlined"
      sx={{
        borderRadius: 2,
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      <CardActionArea onClick={ institution.onClick }>
        <CardContent sx={{ p: 1.5 }}>
          {/* <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Stack spacing={0.5}> */}
              <Typography variant="body1" lineHeight={1.2}>
                { institution.name }
              </Typography>
            {/* </Stack>
          </Stack> */}
        </CardContent>
      </CardActionArea>
    </Card>
  )   
}