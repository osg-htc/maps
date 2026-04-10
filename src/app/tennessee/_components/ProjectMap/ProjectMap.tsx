"use client";

import InstitutionPins from "../InstitutionPins";
import useSWR from 'swr';
import { getProjects, ProjectData } from '@/src/utils/adstash';
import { Box, Typography } from '@mui/material';
import { Circle, Memory, Storage } from '@mui/icons-material';
import StatCard from '@/src/components/StatCard';
import DataServerPin from '@/src/components/DataServerPin';
import osdfServers from '@/src/public/data/servers.json';

const PROJECTS = [
  "Vanderbilt_Paquet",
  "Vanderbilt_Luzum"
]

const CACHE_SERVERS = [
  'dtn-pas.bois.nrp.internet2.edu', 'osdf1.chic.nrp.internet2.edu', 'osdf-uw-cache.svc.osg-htc.org',
  'mghpcc-cache.nationalresearchplatform.org', 'dtn-pas.kans.nrp.internet2.edu', 'dtn-pas.jack.nrp.internet2.edu',
  'unl-cache.nationalresearchplatform.org', 'dtn-pas.cinc.nrp.internet2.edu', 'dtn-pas.denv.nrp.internet2.edu',
  'osg-sunnyvale-stashcache.nrp.internet2.edu', 'ncar-cache.nationalresearchplatform.org', 'osdf1.newy32aoa.nrp.internet2.edu',
  'buzzard-pelican-ext.pace.gatech.edu', 'osg-houston-stashcache.nrp.internet2.edu', 'fdp-d3d-cache.nationalresearchplatform.org',
  'osdf-cache.ligo-wa.caltech.edu', 'ucsd-t2-cache.nationalresearchplatform.org', 'osg-new-york-stashcache.nrp.internet2.edu',
  'osg-hawk-cache.cc.lehigh.edu', 'osdfcache.ligo.caltech.edu', 'osg-chicago-stashcache.nrp.internet2.edu',
  'dtn-pas.hous.nrp.internet2.edu', 'osdf-cache-01.gwave.ics.psu.edu', 'sdsc-cache.nationalresearchplatform.org',
  'osg-stash-sfu-computecanada-ca.nationalresearchplatform.org', 'stashcache.gwave.ics.psu.edu',
  'pelican-cache.rc.duke.edu', 'ap40.uw.osg-htc.org', 'rc-pelican.syr.edu', 'osdf-cache.sprace.org.br',
  'its-condor-xrootd1.syr.edu', 'stashcache.ligo-la.caltech.edu', 'ligo-cache-01.gwave.ics.psu.edu',
  'purdue-cache.nationalresearchplatform.org', 'fdp-cache.labs.hpe.com', 'ccpelicanli01.in2p3.fr',
  'ligo.hpc.swin.edu.au', 'amst-fiona.nationalresearchplatform.org', 'osdfcache01.crc.nd.edu',
  'xsod14.cr.cnaf.infn.it', 'cf-ac-uk-cache.nationalresearchplatform.org', 'osdf1.amst.nrp.internet2.edu'
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ProjectMap = () => {

  const { data: projects } = useSWR([getProjects], () => getProjects());

  const tennesseeProjects = Object.values(projects ?? {}).filter(p => PROJECTS.includes(p.projectName ?? ""));

  const filteredDataServers = (osdfServers || []).filter(server => {
    const serverUrl = (server.url || '')

    return CACHE_SERVERS.some(cache => serverUrl.includes(cache)) &&
           server.latitude && server.longitude && server.latitude !== 0;
  });

  // Find cache servers that didn't match any OSDF servers
  const matchedServerNames = filteredDataServers.map(server => {
    const serverUrl = (server.url || '').replace('https://', '');
    return CACHE_SERVERS.find(cache => serverUrl.includes(cache));
  }).filter(Boolean);

  const unmatchedServers = CACHE_SERVERS.filter(cache =>
    !matchedServerNames.includes(cache)
  );

  console.log("Matched:", filteredDataServers.length, "/ Expected:", CACHE_SERVERS.length);
  console.log(`Total unmatched: ${unmatchedServers.length}\n`, unmatchedServers);

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
            <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center', color: 'white' }}>
              Research Projects at Tennessee Institutions running on the OSPool
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, textAlign: 'center', mb: 1, color: '#e3e3e3' }}
            >
              April 2025 to April 2026
            </Typography>
          </Box>
          <StatCard label="Total Jobs Ran" value={1428310} />
          <StatCard label="CPU Hours Used" value={2335599.72} />
          <StatCard label="Files Transferred via the OSDF" value={1554421} />
          <StatCard label="Gigabytes Transferred via the OSDF" value={1088466.50} />
        </Box>
      </Box>
      {tennesseeProjects.map((p, i) => (
        <InstitutionPins key={i} project={p as ProjectData}></InstitutionPins>
      ))}
      {filteredDataServers.map((server, idx) => (
        <DataServerPin
          key={`server-${idx}`}
          name={server.name}
          serverType={server.type}
          color={'#4CAF50'}
          size={25}
          lat={server.latitude}
          lon={server.longitude}
        />
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
          OSG Contributors to Tennessee Research Projects
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ position: 'relative', width: 30, height: 30, mt: 1}}>
            <Circle sx={{
              color: 'black',
              fontSize: 30,
            }} />
            <Memory sx={{
              color: 'primary.main',
              fontSize: 21,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }} />
          </Box>
          <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
            Computing Contributing Institution Location
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, ml: .3 }}>
          <Box sx={{ position: 'relative', width: 25, height: 25 }}>
            <Circle sx={{
              color: '#4CAF50',
              fontSize: 25,
            }} />
            <Storage sx={{
              color: 'white',
              fontSize: 15,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }} />
          </Box>
          <Typography variant="body2" sx={{ color: 'white' }}>
            OSDF Cache Location
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default ProjectMap;
