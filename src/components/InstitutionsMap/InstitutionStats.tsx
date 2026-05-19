
import { Typography } from '@mui/material';
import { InstitutionData } from '@/src/utils/adstash';
import { numberWithCommas, formatBytes, pastYearDateRange } from '@/src/utils/helpers'
import StatisticsCard from '../StatisticsCard';

export default function InstitutionStats({ stats, date }: { stats: InstitutionData, date: Date }) {
  return (
    <>
      <StatisticsCard title='Jobs Ran' content={numberWithCommas(stats.numJobs)} />
      {stats.cpuHours < 1 ? <></> : <StatisticsCard title='CPU Hours Provided' content={numberWithCommas(Math.round(stats.cpuHours))} /> }
      {stats.gpuHours < 1 ? <></> : <StatisticsCard title='GPU Hours Provided' content={numberWithCommas(Math.round(stats.gpuHours))} /> }
      {stats.osdfFileTransferCount < 1 ? <></> : <StatisticsCard title='Files transferred via the OSDF' content={numberWithCommas(Math.round(stats.osdfFileTransferCount))} /> }
      {stats.osdfByteTransferCount < 1 ? <></> : <StatisticsCard title='Bytes transferred by the OSDF' content={formatBytes(stats.osdfByteTransferCount)} /> }
      <Typography align="center" variant="subtitle2" fontStyle='italic' sx={{mt: "4px !important"}}>{pastYearDateRange(date)}</Typography>
    </>
  )
}
