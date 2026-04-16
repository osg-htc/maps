import { ProjectData } from '@/src/utils/adstash';
import { Typography, Stack, Card, CardContent, CardActionArea, Divider, Grid, Chip, Tooltip, Box } from '@mui/material';
import { addSpacesToUnderscores, formatNumber } from '@/src/utils/formatters';
import { ProjectPinProps } from './ProjectPins';
import ListCardBase from '../ListCardBase';

export default function InsitutionListCard({ institution }: {institution: ProjectPinProps } ) {
  return (
    <ListCardBase listKey={ institution.name } onClick={ institution.onClick }>
      <Typography variant="body1" lineHeight={1.2}>
        { institution.name }
      </Typography>
    </ListCardBase>
  )   
}