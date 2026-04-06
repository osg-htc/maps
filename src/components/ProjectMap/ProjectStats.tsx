import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import ProjectMapPin from '../MapPin'
import { ProjectData } from '@/src/utils/adstash';

function ProjectStats({ stats }: { stats: ProjectData}) {
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
