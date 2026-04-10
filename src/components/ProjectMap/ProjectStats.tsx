
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { ProjectData } from '@/src/utils/adstash';
import { numberWithCommas, thatsOverText } from '@/src/utils/formatters'

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
      <Card key={ "numJobs" } variant="outlined">
        <CardContent sx={{ p: "12px !important" }}>
          <Typography variant="h6">{ numberWithCommas(stats.numJobs) } Jobs Ran</Typography>
        </CardContent>
      </Card>
      {stats.cpuHours < 1 ? <></> :<Card key={"cpuHours"} variant="outlined">
        <CardContent sx={{ p: "12px !important" }}>
          <Typography variant="h6">{numberWithCommas(Math.round(stats.cpuHours))} hours of CPU time</Typography>
          {stats.cpuHours > 24 * 60 * 2 ? <Typography variant="subtitle1"> Thats over {thatsOverText(stats.cpuHours)}</Typography> : <></>}
        </CardContent>
      </Card>}
        {stats.gpuHours < 1 ? <></> :<Card key={"gpuHours"} variant="outlined">
        <CardContent sx={{ p: "12px !important" }}>
          <Typography variant="h6">{numberWithCommas(Math.round(stats.gpuHours))} hours of GPU time</Typography>
          {stats.gpuHours > 24 * 60 * 2 ? <Typography variant="subtitle1"> Thats over {thatsOverText(stats.gpuHours)}</Typography> : <></>}
        </CardContent>
      </Card>}
    </>
  )
}

export default ProjectStats;
