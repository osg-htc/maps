import { ProjectData } from '@/src/utils/adstash';
import { Typography, Stack, Card, CardContent, CardActionArea } from '@mui/material';

function ProjectList({ projects, click }: { projects: ProjectData[], click: (arg0: string) => void } ) {
  return (
    <>
      {projects.map((project: ProjectData, i) => 
        <Card key={ i }>
          <CardActionArea onClick={() => { click(project.projectName) }}>
            <CardContent>
              <Typography>{project.projectName}</Typography>
              <Typography>{project.detailedFieldOfScience}</Typography>
              <Typography>{project.projectInstitutionName}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </>
  )   
}

export default ProjectList;
