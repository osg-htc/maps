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
        bgcolor: 'rgba(255, 255, 255, 0.98)',
        overflowY: 'auto',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',

      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.9,
          p: 2
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center', mb: 1 }}>
            OSPool Projects In Tennessee
          </Typography>

          <Paper elevation={3} sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#f5f5f5'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              Total Jobs
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '4rem' }}>
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
            bgcolor: '#f5f5f5'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              CPU Hours
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '4rem' }}>
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
            bgcolor: '#f5f5f5'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              OSDF Files Transferred
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '4rem' }}>
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
            bgcolor: '#f5f5f5'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              OSDF GB Transferred
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '4rem' }}>
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
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: 2,
        borderRadius: 2,
        pointerEvents: "auto",
        zIndex: 1000,
        maxWidth: "550px",
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          OSPool Contributors to Tennessee Projects
        </Typography>
        <Typography variant="subtitle2" gutterBottom sx={{mt: 1 }}>
          Each marker on the map represents an institution that contributed capacity to a project based in Tennessee.
        </Typography>
      </Box>
    </>
  )
}

export default ProjectMap;
