import { ProjectData } from '@/src/utils/adstash';
import { Typography, Stack, Paper, Card, CardContent, CardActionArea } from '@mui/material';

function ProjectList({ projects, click }: { projects: ProjectData[], click: (arg0: string) => void } ) {
  return (
    <Stack component={'div'} spacing={2} sx={{
      p: 2,
      top: 0,
      left: 0,
      zIndex: 999,
      backgroundColor: "#fff",
      boxSizing: 'border-box',
      minHeight: '100%',
      minWidth: '100%'
    }}>
      {projects.map((project: ProjectData, i) => 
        <Card key={ i } sx={{ maxWidth: 345 }}>
          <CardActionArea onClick={() => { click(project.projectName) }}>
            <CardContent>
              <Typography>{project.projectName}</Typography>
              <Typography>{project.detailedFieldOfScience}</Typography>
              <Typography>{project.projectInstitutionName}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </Stack >
  )   
}

export default ProjectList;
