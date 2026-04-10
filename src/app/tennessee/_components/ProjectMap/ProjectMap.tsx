"use client";

import InstitutionPins from "../InstitutionPins";
import useSWR from 'swr';
import { getProjects, ProjectData } from '@/src/utils/adstash';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { LocationPin } from '@mui/icons-material';
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
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}>
        <Box p={2}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            OSPool Projects In Tennessee
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
            Total Statistics
          </Typography>

          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total Jobs</TableCell>
                  <TableCell align="right">{formatNumber(1428310)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CPU Hours</TableCell>
                  <TableCell align="right">{formatNumber(2335599.72)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>OSDF Files Transferred</TableCell>
                  <TableCell align="right">{formatNumber(1554421)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>OSDF GB Transferred</TableCell>
                  <TableCell align="right">{formatNumber(1088466.50)} GB</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 1 }}>
            Projects Breakdown
          </Typography>

          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Jobs</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>CPU Hours</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Files</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>GB</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Vanderbilt_Paquet</TableCell>
                  <TableCell align="right">{formatNumber(1367443)}</TableCell>
                  <TableCell align="right">{formatNumber(2114048.65)}</TableCell>
                  <TableCell align="right">{formatNumber(1485962)}</TableCell>
                  <TableCell align="right">{formatNumber(938053.46)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Vanderbilt_Luzum</TableCell>
                  <TableCell align="right">{formatNumber(60867)}</TableCell>
                  <TableCell align="right">{formatNumber(221551.07)}</TableCell>
                  <TableCell align="right">{formatNumber(68459)}</TableCell>
                  <TableCell align="right">{formatNumber(150413.04)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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
        boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
        pointerEvents: "auto",
        zIndex: 1000,
        maxWidth: "550px",
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
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
