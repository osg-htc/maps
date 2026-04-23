import { Typography } from '@mui/material';
import ListCardBase from '../ListCardBase';
import React from 'react';
import { ProjectData } from '@/src/utils/adstash';

function ProjectInsitutionListCard({ project, onClick }: { project: ProjectData, onClick: () => void }) {
  return (
    <ListCardBase onClick={ onClick }>
      <Typography color="secondary.main" variant="body1" lineHeight={1.2}>
        { project.projectInstitutionName }
      </Typography>
    </ListCardBase>
  )   
}

export default React.memo(ProjectInsitutionListCard)