import { Typography } from '@mui/material';
import ListCardBase from '../ListCardBase';
import { InstitutionData } from '@/src/utils/adstash';
import React from 'react';

function InstitutionListCard({ institution, onClick }: { institution: InstitutionData, onClick: () => void }) {
  return (
    <ListCardBase onClick={ onClick }>
      <Typography color="secondary.main" variant="body1" lineHeight={1.2}>
        { institution.institutionName }
      </Typography>
    </ListCardBase>
  )   
}

export default React.memo(InstitutionListCard)