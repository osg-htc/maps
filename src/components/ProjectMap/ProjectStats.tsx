
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { ProjectData } from '@/src/utils/adstash';
import { numberWithCommas, thatsOverText, formatBytes } from '@/src/utils/formatters'

function ProjectStats({ stats }: { stats: ProjectData}) {
  return (
    <>
      <Typography variant="subtitle1" align='center'>
        April 2025 to April 2026
      </Typography>
      <Card key={ "numJobs" } variant="outlined">
        <CardContent sx={{ p: "12px !important" }}>
          <Typography color="secondary.main" align='center' variant="h6">Jobs Ran</Typography>
          <Typography lineHeight={1} color="primary.main" align='center' variant="h3">{ numberWithCommas(stats.numJobs) }</Typography>
        </CardContent>
      </Card>
      {stats.cpuHours < 1 ? <></> :
        <Card key={"cpuHours"} variant="outlined">
          <CardContent sx={{ p: "12px !important" }}>
            <Typography color="secondary.main" align='center' variant="h6">CPU Hours Used</Typography>
            <Typography lineHeight={1} color="primary.main" align='center' variant="h3">{numberWithCommas(Math.round(stats.cpuHours))}</Typography>
            {/* {stats.cpuHours > 24 * 60 * 2 ? <Typography align='center' variant="subtitle2">Thats over {thatsOverText(stats.cpuHours)}</Typography> : <></>} */}
          </CardContent>
        </Card>
      }
      {stats.gpuHours < 1 ? <></> :
        <Card key={"gpuHours"} variant="outlined">
          <CardContent sx={{ p: "12px !important" }}>
            <Typography color="secondary.main" align='center' variant="h6">GPU Hours Used</Typography>
            <Typography lineHeight={1} color="primary.main" align='center' variant="h3">{numberWithCommas(Math.round(stats.gpuHours))}</Typography>
            {/* {stats.gpuHours > 24 * 60 * 2 ? <Typography align='center' variant="subtitle2">Thats over {thatsOverText(stats.gpuHours)}</Typography> : <></>} */}
          </CardContent>
        </Card>
      }
      {stats.osdfFileTransferCount < 1 ? <></> :
        <Card key={"osdfFileTransferCount"} variant="outlined">
          <CardContent sx={{ p: "12px !important" }}>
            <Typography color="secondary.main" align='center' variant="h6">Files transferred via the OSDF</Typography>
            <Typography lineHeight={1} color="primary.main" align='center' variant="h3">{numberWithCommas(Math.round(stats.osdfFileTransferCount))}</Typography>
          </CardContent>
        </Card>
      }
      {stats.osdfByteTransferCount < 1000 ? <></> :
        <Card key={"osdfByteTransferCount"} variant="outlined">
          <CardContent sx={{ p: "12px !important" }}>
            <Typography lineHeight={1} color="secondary.main" align='center' variant="h6">Bytes transferred by the OSDF</Typography>
            <Typography color="primary.main" align='center' variant="h3">{formatBytes(stats.osdfByteTransferCount)}</Typography>
          </CardContent>
        </Card>
      }
    </>
  )
}

export default ProjectStats;
