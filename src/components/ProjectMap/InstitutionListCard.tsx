import { Typography } from '@mui/material';
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