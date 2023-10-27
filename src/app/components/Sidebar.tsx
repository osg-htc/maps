// Sidebar.js
import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Feature } from '../../../types/mapTypes';

type SidebarProps = {
    feature: Feature;
    onClose: () => void;
  }
  
const Sidebar: React.FC<SidebarProps> = ({ feature, onClose }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
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
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">
          {feature.properties["Institution Name"] || "Placeholder Name"}
        </Typography>
        <Typography variant="button" onClick={onClose}>
          Close
        </Typography>
      </Box>

      <Divider />

      {/* List for Projects */}
      <Typography variant="subtitle1" gutterBottom>
          Projects supported by {feature.properties["Institution Name"] || "Placeholder Name"}
        </Typography>
        <List dense>
          {/* Sample List Items */}
          <ListItem>
            <ListItemText primary="Placeholder Project" secondary="Provided Core Hours: 12345" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Placeholder Project 2" secondary="Provided Core Hours: 67890" />
          </ListItem>
        </List>

        <Divider />

        {/* List for Fields of Sciences */}
        <Typography variant="subtitle1" gutterBottom>
          Fields of Sciences Supported by {feature.properties["Institution Name"] || "Placeholder Name"}
        </Typography>
        <List dense>
          {/* Sample List Items */}
          <ListItem>
            <ListItemText primary="Placeholder Field" secondary="Provided Core Hours: 12345" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Placeholder Field 2" secondary="Provided Core Hours: 67890" />
          </ListItem>
        </List>

        <Divider />

        {/* Total Jobs & CPU Hours */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Box textAlign="center">
            <Typography variant="h4">12,711</Typography>
            <Typography variant="body2">Total Jobs Run</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4">54,826</Typography>
            <Typography variant="body2">CPU Hours Provided</Typography>
          </Box>
        </Box>
    </Box>
  );
};

export default Sidebar;
