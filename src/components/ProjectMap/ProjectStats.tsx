import { LocationPin, Circle } from '@mui/icons-material';
import { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography } from '@mui/material';
import ProjectMapPin from '../MapPin'

export type ProjectStatsProps = {
  numJobs: number,
  cpuHours: number,
  gpuHours: number,
  byteTransferCount: number,
  fileTransferCount: number,
  osdfByteTransferCount: number,
  osdfFileTransferCount: number,
}

function ProjectStats({ stats }: { stats: ProjectStatsProps }) {
  return (
    <>
      <Typography>numJobs: { stats.numJobs }</Typography>
      <Typography>cpuHours: { stats.cpuHours }</Typography>
      <Typography>gpuHours: { stats.gpuHours }</Typography>
      <Typography>byteTransferCount: { stats.byteTransferCount }</Typography>
      <Typography>fileTransferCount: { stats.fileTransferCount }</Typography>
      <Typography>osdfByteTransferCount: { stats.osdfByteTransferCount }</Typography>
      <Typography>osdfFileTransferCount: { stats.osdfFileTransferCount }</Typography>
    </>
  )
}

export default ProjectStats;
