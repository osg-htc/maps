import { Typography, Stack, Paper } from '@mui/material';

export type ProjectListItemProps = {
  name: string,
  field: string,
  institution: string,
  onClick: () => void,
}

function ProjectList({ projects }: {projects: ProjectListItemProps[]} ) {
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
      {projects.map((project: ProjectListItemProps) => 
        <Paper elevation={2} sx={{ backgroundColor: "#fff", height: 100, borderRadius: 5, p: 1 }}>
          <Typography>{project.name}</Typography>
          <Typography>{project.field}</Typography>
          <Typography>{project.institution}</Typography>
        </Paper>
      )}
    </Stack >
  )   
}

export default ProjectList;
