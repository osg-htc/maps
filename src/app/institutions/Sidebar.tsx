import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  Slide,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import useTheme from '@mui/material/styles/useTheme';
import { sub } from 'date-fns';
import { GrafanaPanelProps, SidebarProps } from '../types/mapTypes';
import Link from 'next/link';

const GrafanaPanel: React.FC<GrafanaPanelProps> = ({
  panelId,
  panelUrl,
  start,
  end,
  orgId,
  facultyName,
}) => {
  const url = `${panelUrl}?to=${end}&from=${start}&orgId=${orgId}&panelId=${panelId}&var-facility=${facultyName}`;
  return <iframe src={url} width='100%' height='250px' title='Faculty Panel' />;
};

const Sidebar: React.FC<SidebarProps> = ({
  onClose,
  header,
  facultyName,
  dataState,
  website
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const formattedWebsite = website && !/^https?:\/\//i.test(website) ? `https://${website}` : website;
  const data = {
    panelId: [12, 16, 8, 6, 2],
    panelUrl: `https://gracc.opensciencegrid.org/d-solo/axV4YtN4k/facility`,
    start: sub(new Date(), { years: 1 }).getTime(),
    end: new Date().getTime(),
    orgId: 1,
  };
  return (
    <Slide direction='right' in={true} mountOnEnter unmountOnExit>
      <Box
        component='aside'
        sx={{
          width: isSmallScreen ? '100%' : '40%',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          zIndex: 10,
          padding: 2,
        }}
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h6'>
            {website ? (
                <Link href={formattedWebsite} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{color: 'darkorange', cursor: 'pointer'}}>
                    {header}
                  </a>
                </Link>
            ) : (
                header
            )}
          </Typography>
          <IconButton onClick={onClose} edge='end' aria-label='close sidebar'>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box className='flex gap-2 flex-col lg-custom:flex-row my-2'>
          <GrafanaPanel
            panelId={12}
            panelUrl={data.panelUrl}
            start={data.start}
            end={data.end}
            orgId={data.orgId}
            facultyName={facultyName}
          />
          <GrafanaPanel
            panelId={16}
            panelUrl={data.panelUrl}
            start={data.start}
            end={data.end}
            orgId={data.orgId}
            facultyName={facultyName}
          />
        </Box>
        <Box className='flex gap-2 flex-col lg-custom:flex-row my-2'>
          <GrafanaPanel
            panelId={6}
            panelUrl={data.panelUrl}
            start={data.start}
            end={data.end}
            orgId={data.orgId}
            facultyName={facultyName}
          />
        </Box>
        <Box className='flex gap-2 flex-col lg-custom:flex-row my-2 '>
          <GrafanaPanel
            panelId={2}
            panelUrl={data.panelUrl}
            start={data.start}
            end={data.end}
            orgId={data.orgId}
            facultyName={facultyName}
          />
          {dataState ? (
            <GrafanaPanel
              panelId={8}
              panelUrl={data.panelUrl}
              start={data.start}
              end={data.end}
              orgId={data.orgId}
              facultyName={facultyName}
            />
          ) : undefined}
        </Box>
      </Box>
    </Slide>
  );
};

export default Sidebar;
