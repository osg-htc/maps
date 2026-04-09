
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { ProjectData } from '@/src/utils/adstash';

function ProjectStats({ stats }: { stats: ProjectData}) {
  return (
    <>
      <Card key={ 1 }>
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
    </>
  )
}

export default ProjectStats;
