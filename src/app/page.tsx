'use client';
import React, {CSSProperties, useState} from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import CircularProgress from '@mui/material/CircularProgress';
import NavigationButtons from "@/app/components/NavigationButtons";

function HomePage() {
    const [selectedButton, setSelectedButton] = useState('projects');

    const DynamicProjects = dynamic(() => import('../app/projects/page'), {
        ssr: false,
        loading: () => (
            <Box sx={{marginTop: '5em', textAlign: 'center'}}>
                <CircularProgress style={{color: 'darkorange', alignContent: 'center'}}/>
            </Box>
        ),
    });
    const DynamicInstitutions = dynamic(
        () => import('../app/institutions/page'),
        {
            ssr: false,
            loading: () => (
                <Box sx={{marginTop: '5em', textAlign: 'center'}}>
                    <CircularProgress style={{color: 'darkorange', alignContent: 'center'}}/>
                </Box>
            ),
        }
    );

    return (
        <Box height={'100vh'} width={'100vw'}>
            <NavigationButtons/>
            {selectedButton === 'projects' ? (
                <DynamicProjects/>
            ) : (
                <DynamicInstitutions/>
            )}
        </Box>
    );
}

export default HomePage;
