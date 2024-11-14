'use client';
import React, {CSSProperties, useState} from 'react';
import { Box } from '@mui/material';
import DynamicProjects from './projects/page';
import DynamicInstitutions from './institutions/page';
import NavigationButtons from './components/NavigationButtons';

function HomePage() {
    const [selectedButton, setSelectedButton] = useState('projects');

    return (
        <Box height={'100vh'} width={'100vw'}>
            {/*<NavigationButtons/>*/}
            {selectedButton === 'projects' ? (
                <DynamicProjects/>
            ) : (
                <DynamicInstitutions/>
            )}
        </Box>
    );
}

export default HomePage;
