'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Marker } from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Badge, Tooltip, BadgeProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import esProjects from '../../data/esProjects';
import Sidebar from './Sidebar';
import { useSearchParams } from 'next/navigation';
import SearchBar from "@/app/components/SearchBar";
// @ts-ignore
import { Institution, Project, ProjectWithESData, InstitutionWithProjects} from '@/types/mapTypes';
import DataCard from '@/app/components/DataCard';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 0,
        top: 5,
        padding: '0 4px',
        backgroundColor: 'black',
        color: 'white',
    },
}));

const MarkersComponent: React.FC<{
    mapRef: any,
    institutionsWithProjects: InstitutionWithProjects[]
}> = ({ mapRef, institutionsWithProjects}) => {

    const searchParams = useSearchParams()
    const faculty = searchParams.get('faculty');
    const [markerSize, setMarkerSize] = useState<'small' | 'large'>('small');
    const [selectedMarker, setSelectedMarker] = useState<InstitutionWithProjects | null>(null);
    const [facultyName, setFacultyName] = useState<string>('');
    const zoomRef = useRef(0);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
        fieldOfScience: [],
        department: [],
        piName: [],
    });


    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current.getMap();
        const handleZoom = () => {
            const zoom = map.getZoom();
            zoomRef.current = zoom;

            // Only update state if the marker size needs to change
            const newSize = zoom < 3 ? 'small' : 'large';
            if (markerSize !== newSize) {
                setMarkerSize(newSize);
            }
        };

        // Update the URL with the current zoom level once the user interaction is finished
        const handleIdle = () => {
            const url = new URL(window.location.href);
            url.searchParams.set('zoom', zoomRef.current.toFixed(2));
            window.history.replaceState(null, '', url.toString());
        };

        map.on('zoom', handleZoom);
        map.on('idle', handleIdle);

        return () => {
            map.off('zoom', handleZoom);
            map.off('idle', handleIdle);
        };
    }, [markerSize, mapRef]);

    // Read zoom level from URL on first load
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current.getMap();
        const zoomFromUrl = searchParams.get('zoom');

        if (zoomFromUrl) {
            const zoom = parseFloat(zoomFromUrl);
            if (!isNaN(zoom)) {
                map.setZoom(zoom);
                zoomRef.current = zoom;
            }
        }
    }, [searchParams, mapRef]);


    // useEffect(() => {
    //     const handleUrlChange = () => {
    //         const currentPath = window.location.pathname;
    //         if (currentPath === '/maps/institutions' || currentPath === '/maps/projects') {
    //             handleResetNorth();
    //         }
    //     };
    //
    //     handleUrlChange();
    //
    //     window.addEventListener('popstate', handleUrlChange);
    //
    //     return () => {
    //         window.removeEventListener('popstate', handleUrlChange);
    //     };
    // }, []);



    // console.log('institutionsWithProjects', institutionsWithProjects);

    // Set selected marker based on the faculty query parameter on mount
    useEffect(() => {
        if (faculty && institutionsWithProjects.length > 0) {
            const decodedFaculty = decodeURIComponent(faculty); // Decode the faculty name

            const matchedInstitution = institutionsWithProjects.find(
                (iwp) => iwp.name === decodedFaculty
            );

            if (matchedInstitution) {
                setSelectedMarker(matchedInstitution);
                setFacultyName(decodedFaculty);
                centerToMarker(matchedInstitution);
            }
        }
    }, [faculty, institutionsWithProjects]);

    const handleResetNorth = () => {
        const map = mapRef.current.getMap();
        map.flyTo({
            zoom: 4.5,
            duration: 2000,
        });
    };

    const convertName = (institutionName: string) => {
        const convertedName = encodeURIComponent(institutionName);
        setFacultyName(convertedName);
        return convertedName;
    };

    const closeSidebar = () => {
        window.history.pushState(null, '', `/maps/projects`);
        setSelectedMarker(null);
        handleResetNorth();
    };

    const centerToMarker = (institution: Institution) => {
        const map = mapRef.current.getMap();
        map.flyTo({
            center: [institution.longitude, institution.latitude],
            zoom: Math.max(zoomRef.current, 8),
            duration: 1500,
        });
    };

    const handleSelectInstitution = (institution: Institution) => {
        setSelectedMarker(institution);

        // console.log('slected marker', selectedMarker);
        centerToMarker(institution);
        const convertedName = convertName(institution.name);
        window.history.pushState(null, '', `/maps/institutions?faculty=${convertedName}&zoom=${zoomRef.current.toFixed(2)}`);
    };

    const handleFilterUpdate = (filters: { [key: string]: string[]}) => {
        setSelectedFilters(filters)
    }

    // filter the list of institutions based on the selected field of science
    const filteredInstitutionsWithProjects = useMemo(() => {
        // console.log("Institutions with projects:", institutionsWithProjects);
        // console.log("Selected filters:", selectedFilters);

        return institutionsWithProjects.filter((institution) => {
            if (selectedFilters.fieldOfScience.length > 0) {
                const hasMatchingField = institution.projects.some((project: ProjectWithESData) => {
                    return (
                      project.FieldOfScience &&
                      selectedFilters.fieldOfScience.some((field) =>
                        project.FieldOfScience.includes(field)
                      )
                    );
                });
                if (!hasMatchingField) return false;
            }

            return true;
        });
    }, [institutionsWithProjects, selectedFilters]);

    // console.log("filteredInstitutionsWithProjects", filteredInstitutionsWithProjects);

    const markers = useMemo(() => {
        const handleMarkerClick = (institution: InstitutionWithProjects) => {
            setSelectedMarker(institution);
            const convertedName = convertName(institution.name);
            centerToMarker(institution);
            window.history.pushState(null, '', `/maps/projects?faculty=${convertedName}`);
        };

        return filteredInstitutionsWithProjects
            .sort((a, b) => b.latitude - a.latitude)
            .map((institution) => (

            <Marker
                key={institution.id}
                longitude={institution.longitude}
                latitude={institution.latitude}
            >
                {zoomRef.current >= 3 && (
                  <StyledBadge badgeContent={institution.projects.length} style={{ color: 'blue' }}>
                      <Tooltip title={institution.name} placement="top">
                          <LocationOnIcon
                            color="primary"
                            className="hover:scale-150 transition duration-300 ease-in-out cursor-pointer"
                            fontSize={markerSize}
                            onClick={() => handleMarkerClick(institution)}
                            style={{ color: "darkorange", cursor: "pointer"}}
                          />
                      </Tooltip>
                  </StyledBadge>
                )}
                {zoomRef.current < 3 && (
                  <Tooltip title={institution.name} placement="top">
                      <LocationOnIcon
                        color="primary"
                        className="hover:scale-150 transition duration-300 ease-in-out cursor-pointer"
                        fontSize={markerSize}
                        onClick={() => handleMarkerClick(institution)}
                        style={{ color: "darkorange", cursor: "pointer"}}
                      />
                  </Tooltip>
                )}

            </Marker>

        ));
    }, [filteredInstitutionsWithProjects, markerSize, mapRef]);

    return (
        <>
            <SearchBar institutions={filteredInstitutionsWithProjects}
                       onSelectInstitution={handleSelectInstitution}
                       shifted={Boolean(selectedMarker)}
                       onFilterUpdate={handleFilterUpdate}
            />
            <DataCard
                institutionsLabel={'Project Institutions:'}
              numberOfInstitutions={filteredInstitutionsWithProjects.length}
              shifted={Boolean(selectedMarker)}
              numberOfProjects={filteredInstitutionsWithProjects.reduce((acc, institution) => acc + institution.projects.length, 0)}
            />
            {markers}
            {selectedMarker && (
                <Sidebar
                    facultyName={facultyName}
                    onClose={closeSidebar}
                    header={selectedMarker.name}
                    projects={selectedMarker.projects}
                    dataState={selectedMarker}
                    selectedMarker={selectedMarker}
                    website={selectedMarker.ipeds_metadata?.website_address}
                />
            )}
        </>
    );
};

export default MarkersComponent;
