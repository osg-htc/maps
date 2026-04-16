import { ProjectData } from '@/src/utils/adstash';
import { Typography, Stack, Chip } from '@mui/material';
import { addSpacesToUnderscores, formatNumber } from '@/src/utils/formatters';
import ListCardBase from '../ListCardBase';

export default function ProjectListCard({ project, click }: { project: ProjectData, click: (arg0: string) => void } ) {
  return (
    <ListCardBase listKey={ project.projectName } onClick={ () => click( project.projectName )}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Stack spacing={0.5}>
          <Typography variant="h6" lineHeight={1.2}>
            { addSpacesToUnderscores(project.projectName) }
          </Typography>
          <Typography variant="body2" lineHeight={1.1}>
            { project.detailedFieldOfScience }
          </Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1}>
            { project.projectInstitutionName }
          </Typography>
        </Stack>
        <Chip
          label={ formatNumber(project.numJobs) + " Jobs"}
          size="small"
          color="primary"
          variant="outlined"
          sx={{
            flexShrink: 0,
            fontSize: "0.7rem",
            m: "0 !important"
          }}
        />
      </Stack>
    </ListCardBase>
  )   
}