import React from 'react';
import { Box, IconButton, Typography, useMediaQuery, Slide } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import useTheme from '@mui/material/styles/useTheme';
import { sub } from 'date-fns';

type SidebarProps = {
  onClose: () => void;
  header: string;
  facultyName: string;
  dataState?: boolean;
}
type HTMLContentProps = {
  html: string;
}

const HTMLContent: React.FC<HTMLContentProps> = ({ html }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
};

type GrafanaPanelProps = {
  panelId: number;
  panelUrl: string;
  start: number;
  end: number;
  orgId: number;
  facultyName: string;
}


const GrafanaPanel: React.FC<GrafanaPanelProps> = ({ panelId, panelUrl, start, end, orgId, facultyName }) => {
  const url = `${panelUrl}?to=${end}&from=${start}&orgId=${orgId}&panelId=${panelId}&var-facility=${facultyName}`;
  return (
    <iframe
      src={url}
      width="100%"
      height="250px"
      title="Faculty Panel" 
    />
  );
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, header, facultyName, dataState}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const data = {
    panelId:[12, 16, 8, 6, 2],
    panelUrl: `https://gracc.opensciencegrid.org/d-solo/axV4YtN4k/facility`,
    start: sub(new Date(), { years: 1 }).getTime(),
    end: new Date().getTime(),
    orgId: 1
  }
  return (
    <Slide direction="right" in={true} mountOnEnter unmountOnExit>
    <Box
      component="aside"
      sx={{
        width: isSmallScreen ? '100%' : '50%',
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{header}</Typography>
        <IconButton onClick={onClose} edge="end" aria-label="close sidebar">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box className="flex gap-2 flex-col sm:flex-row my-2">
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
        <Box className={`flex gap-2 flex-col ${dataState ? 'sm:flex-row' : 'sm:flex-col'} my-2`}>
            <GrafanaPanel
                panelId={6}
                panelUrl={data.panelUrl}
                start={data.start}
                end={data.end}
                orgId={data.orgId}
                facultyName={facultyName}
            />
            <GrafanaPanel
                panelId={2}
                panelUrl={data.panelUrl}
                start={data.start}
                end={data.end}
                orgId={data.orgId}
                facultyName={facultyName}
            />
        </Box>
        <Box className="flex flex-col sm:flex-row my-2 ">
          { dataState ?
            <GrafanaPanel
                panelId={8}
                panelUrl={data.panelUrl}
                start={data.start}
                end={data.end}
                orgId={data.orgId}
                facultyName={facultyName}
            /> : undefined
          }
        </Box>
    </Box>
    </Slide>
  );
};

export default Sidebar;
