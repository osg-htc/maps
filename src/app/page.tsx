"use client"
import React, { CSSProperties, useState } from 'react';
import { Button, Typography, ButtonGroup, Box } from '@mui/material';
import dynamic from 'next/dynamic';
import CircularProgress from '@mui/material/CircularProgress';

function HomePage() {
  const [selectedButton, setSelectedButton] = useState('projects');

  const DynamicProjects = dynamic(() => import('../app/projects/page'), {
    ssr: false, 
    loading: () => <Box sx={{marginTop:"5em", textAlign:"center"}}><CircularProgress /></Box>
  });
  const DynamicInstitutions = dynamic(() => import('../app/institutions/page'), {
    ssr: false, 
    loading: () => <Box sx={{marginTop:"5em", textAlign:"center"}}><CircularProgress /></Box>
  });

  const buttonStyles: CSSProperties = {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 9999,
  };
  return (
    <Box height={"100vh"} width={"100vw"}>
      <Box style={buttonStyles}>
        <ButtonGroup>
              {selectedButton === 'projects' ? (
              <Button variant="contained" onClick={() => setSelectedButton("projects")}>
                <Typography variant="body2">
                  Projects
                </Typography>
              </Button>
              ) : (
              <Button variant="outlined" onClick={() => setSelectedButton("projects")}>
                <Typography variant="body2">
                  Projects
                </Typography>
              </Button>
              )
              }
              {selectedButton === 'projects' ? (
              <Button variant="outlined" onClick={() => setSelectedButton("institutions")}>
                <Typography variant="body2">
                  Institutions
                </Typography>
              </Button>
            ) : (
              <Button variant="contained" onClick={() => setSelectedButton("institutions")}>
                <Typography variant="body2">
                  Institutions
                </Typography>
              </Button>
            )
            }
          </ButtonGroup>
        </Box>
        {selectedButton === 'projects' ?
          <DynamicProjects />
            : 
          <DynamicInstitutions />
        }
    </Box>
  );
}


export default HomePage;
