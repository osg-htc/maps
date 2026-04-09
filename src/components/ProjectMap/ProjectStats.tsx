
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { ProjectData } from '@/src/utils/adstash';

function ProjectStats({ stats }: { stats: ProjectData}) {
  return (
    <Stack component={'div'} spacing={2} sx={{
      p: 2,
      top: 0,
      left: 0,
      zIndex: 999,
      backgroundColor: "#fff",
      boxSizing: 'border-box'
    }}>
      <Card key={ 1 } sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography>numJobs: { stats.numJobs }</Typography>
          <Typography>cpuHours: { stats.cpuHours }</Typography>
          <Typography>gpuHours: { stats.gpuHours }</Typography>
          <Typography>byteTransferCount: { stats.byteTransferCount }</Typography>
          <Typography>fileTransferCount: { stats.fileTransferCount }</Typography>
          <Typography>osdfByteTransferCount: { stats.osdfByteTransferCount }</Typography>
          <Typography>osdfFileTransferCount: { stats.osdfFileTransferCount }</Typography>
        </CardContent>
      </Card>
    </Stack >
  )
}

export default ProjectStats;
