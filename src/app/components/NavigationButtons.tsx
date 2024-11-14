'use client';
import React, { CSSProperties, useState, useEffect } from 'react';
import { Button, Typography, ButtonGroup, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavigationButtons = () => {
    const pathname = usePathname();
    const [selectedButton, setSelectedButton] = useState<string>('');

    useEffect(() => {
        const path = pathname?.split('/')[1] || 'projects';
        setSelectedButton(path);
    }, [pathname]);

    const buttonStyles: CSSProperties = {
        position: 'fixed',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 9999,
    };

    return (
        <Box style={buttonStyles}>
            <ButtonGroup>
                <Link href="/projects" passHref legacyBehavior>
                    <Button
                        component="a"
                        variant={selectedButton === 'projects' ? 'contained' : 'outlined'}
                        onClick={() => setSelectedButton('projects')}
                    >
                        <Typography variant="body2">Projects</Typography>
                    </Button>
                </Link>
                <Link href="/institutions" passHref legacyBehavior>
                    <Button
                        component="a"
                        variant={selectedButton === 'institutions' ? 'contained' : 'outlined'}
                        onClick={() => setSelectedButton('institutions')}
                    >
                        <Typography variant="body2">Institutions</Typography>
                    </Button>
                </Link>
            </ButtonGroup>
        </Box>
    );
};

export default NavigationButtons;
