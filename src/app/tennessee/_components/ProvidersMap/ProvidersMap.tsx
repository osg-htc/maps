"use client";

import ProjectPins from "../ProjectPins";
import useSWR from 'swr';
import { getInstitutions, InstitutionData } from '@/src/utils/adstash';
import { Box, Typography } from '@mui/material';
import { Person, Circle, Storage } from '@mui/icons-material';
import StatCard from '@/src/components/StatCard';
import DataServerPin from '@/src/components/DataServerPin';
const INSTITUTIONS = [
  "Rhodes College",
  "University of Tennessee at Chattanooga",
  "Tennessee Technological University"
]

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ProvidersMap = () => {

  const { data: institutions } = useSWR([getInstitutions], () => getInstitutions());

  const tennesseeInstitutions = Object.values(institutions ?? {}).filter(i => INSTITUTIONS.includes(i.institutionName ?? ""));

  // Hardcoded totals from CSV data (April 2025 to April 2026)
  // Rhodes College: 3,861,383 jobs, 3,462,119.1 CPU hours, 3,982,626 files, 988,646.93 GB
  // UTC: 3,725,031 jobs, 786,474.61 CPU hours, 13,367,072 files, 386,451.8 GB
  // Tennessee Tech: 29,337 jobs, 17,101.77 CPU hours, 55,394 files, 16,934.49 GB
  const totals = {
    numJobs: 7615751,  // 3,861,383 + 3,725,031 + 29,337
    cpuHours: 4265695.48,  // 3,462,119.1 + 786,474.61 + 17,101.77
    osdfFileTransferCount: 17405092,  // 3,982,626 + 13,367,072 + 55,394
    osdfByteTransferCount: 1392033.22,  // 988,646.93 + 386,451.8 + 16,934.49
  };

  return (
    <>
      <Box sx={{
        position: 'fixed',
        height: '100vh',
        width: "30vw",
        top: 0,
        left: 0,
        zIndex: 999,
        bgcolor: '#0a1725',
        overflowY: 'auto',
        boxShadow: '2px 0 10px rgba(0,0,0,0.5)',
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.3,
          p: 2
        }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 600, textAlign: 'center', color: 'white' }}>
              Tennessee Institutions Contributing Capacity to the OSPool
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, textAlign: 'center', mb: 1, color: '#e3e3e3' }}
            >
              April 2025 to April 2026
            </Typography>
          </Box>
          <StatCard label="Total Jobs Run" value={totals.numJobs} />
          <StatCard label="CPU Hours Provided" value={totals.cpuHours} />
        </Box>
      </Box>
      {tennesseeInstitutions.map((i, idx) => (
        <ProjectPins key={idx} institution={i as InstitutionData}></ProjectPins>
      ))}
      <Box sx={{
        position: "fixed",
        bottom: 10,
        left: "27.5%",
        transform: "translateX(10%)",
        backgroundColor: "#0a1725",
        padding: 2,
        borderRadius: 2,
        pointerEvents: "auto",
        zIndex: 1000,
        maxWidth: "550px",
        border: '2px solid rgba(255,255,255,0.1)'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Research Projects Using Tennessee Capacity
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ position: 'relative', width: 30, height: 30 }}>
            <Circle sx={{
              color: 'secondary.main',
              fontSize: 30,
            }} />
            <Person sx={{
              color: 'white',
              fontSize: 21,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }} />
          </Box>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Research Project Location
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
          Markers show research projects using Tennessee computing capacity.
        </Typography>
      </Box>
    </>
  )
}

export default ProvidersMap;
