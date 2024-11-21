'use client';
import React, {CSSProperties, useState} from 'react';
import { Box } from '@mui/material';
import DynamicProjects from './projects/page';
import DynamicInstitutions from './institutions/page';
import NavigationButtons from './components/NavigationButtons';
import Link from 'next/link';

function HomePage() {

    return (
        <Box height={'100vh'} width={'100vw'}>
            {/*<NavigationButtons/>*/}
            <Link href={'/projects'}>Maps</Link>
            <Link href={'/institutions'}>Institutions</Link>
        </Box>
    );
}

export default HomePage;
