"use client";

import InstitutionPins from "../InstitutionPins";
import useSWR from 'swr';
import { getProjects, ProjectData } from '@/src/utils/adstash';
import { Box, Typography, Paper } from '@mui/material';
import { formatNumber } from '@/src/utils/formatters';

const PROJECTS = [
  "Vanderbilt_Paquet",
  "Vanderbilt_Luzum"
]

const ProjectMap = () => {

  const { data: projects } = useSWR([getProjects], () => getProjects());

  const tennesseeProjects = Object.values(projects ?? {}).filter(p => PROJECTS.includes(p.projectName ?? ""));

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
            <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center', color: 'white' }}>
              Research Projects at Tennessee Institutions running on the OSPool
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, textAlign: 'center', mb: 1, color: '#e3e3e3' }}
            >
              April 2025 to April 2026
            </Typography>
          </Box>
          <Paper elevation={3} sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#0a1725',
            border: '2px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              Total Jobs Ran
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '4rem', color: 'white' }}>
              {formatNumber(1428310)}
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#0a1725',
            border: '2px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              CPU Hours Used
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '4rem', color: 'white' }}>
              {formatNumber(2335599.72)}
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#0a1725',
            border: '2px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              Files Transferred via the OSDF
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '4rem', color: 'white' }}>
              {formatNumber(1554421)}
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#0a1725',
            border: '2px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              Gigabytes Transferred via the OSDF
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '4rem', color: 'white' }}>
              {formatNumber(1088466.50)}
            </Typography>
          </Paper>
        </Box>
      </Box>
      {tennesseeProjects.map((p, i) => (
        <InstitutionPins key={i} project={p as ProjectData}></InstitutionPins>
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
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
          OSPool Contributors to Tennessee Research Projects
        </Typography>
        <Typography variant="subtitle2" gutterBottom sx={{mt: 1, color: 'white' }}>
          Each marker on the map represents an institution that contributed capacity to a project based at an institution in Tennessee.
        </Typography>
      </Box>
    </>
  )
}

export default ProjectMap;
