import React, { useState, useEffect, useMemo } from 'react';
import { Marker } from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from '@mui/material';
import esProjects from '../../data/esProjects';
import Sidebar from './Sidebar';
import { useSearchParams } from 'next/navigation';
import SearchBar from "@/app/components/SearchBar";
// @ts-ignore
import { Institution, Project, ProjectWithESData, InstitutionWithProjects} from '@/types/mapTypes';

const MarkersComponent: React.FC<{ mapRef: any }> = ({ mapRef }) => {
    const searchParams = useSearchParams();
    const faculty = searchParams.get('faculty');
    const [markerSize, setMarkerSize] = useState<'small' | 'large'>('small');
    const [selectedMarker, setSelectedMarker] = useState<InstitutionWithProjects | null>(null);
    const [facultyName, setFacultyName] = useState<string>('');
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [elasticsearchProjects, setElasticsearchProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Institutions
                const institutionsResponse = await fetch(
                    'https://topology-institutions.osg-htc.org/api/institution_ids'
                );
                const institutionsData: Institution[] = await institutionsResponse.json();
                setInstitutions(institutionsData);

                // Fetch Projects
                const projectsResponse = await fetch('https://topology.opensciencegrid.org/miscproject/json');
                const projectsData = await projectsResponse.json();
                // console.log('Fetched Projects Data:', projectsData);

                // Convert projectsData to array from object
                if (Array.isArray(projectsData)) {
                    setProjects(projectsData);
                } else if (typeof projectsData === 'object' && projectsData !== null) {
                    setProjects(Object.values(projectsData));
                } else {
                    console.error('Unexpected projectsData format:', projectsData);
                    setProjects([]);
                }

                // Fetch Elasticsearch Projects
                const elasticsearchResponse = await esProjects();
                setElasticsearchProjects(elasticsearchResponse.aggregations.projects.buckets);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current.getMap();
        const handleZoom = () => {
            const currentZoom = map.getZoom();
            const newSize = currentZoom < 3 ? 'small' : 'large';
            if (markerSize !== newSize) {
                setMarkerSize(newSize);
            }
        };

        handleZoom();

        map.on('zoom', handleZoom);

        return () => {
            map.off('zoom', handleZoom);
        };
    }, [mapRef, markerSize]);

    const filteredProjects = useMemo(() => {
        const projectNames = new Set(
            elasticsearchProjects.map((project) => project.key)
        );
        return projects.filter((project) =>
            projectNames.has(project.Name)
        );
    }, [elasticsearchProjects, projects]);

    const institutionsWithProjects: InstitutionWithProjects[] = useMemo(() => {
        return institutions.map((institution) => {
            const institutionProjects: ProjectWithESData[] = filteredProjects
                .filter((project) => project.InstitutionID === institution.id)
                .map((proj) => {
                    const projectData = elasticsearchProjects.find((elProj) => elProj.key === proj.Name);
                    return {
                        ...proj,
                        esData: {
                            docCount: projectData?.doc_count || 0,
                            cpuHours: projectData?.projectCpuUse.value || 0,
                            gpuHours: projectData?.projectGpuUse.value || 0,
                            jobsRan: projectData?.projectJobsRan.value || 0,
                        }
                    };
                });

            return {
                ...institution,
                projects: institutionProjects
            };
        }).filter((iwp) => iwp.projects.length > 0);
    }, [institutions, filteredProjects, elasticsearchProjects]);

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
        window.history.pushState(null, '', `/maps`);
        setSelectedMarker(null);
        handleResetNorth();
    };

    const centerToMarker = (institution: Institution) => {
        const map = mapRef.current.getMap();
        map.flyTo({
            center: [institution.longitude, institution.latitude],
            zoom: 8,
            duration: 2000,
        });
    };

    const handleSelectInstitution = (institution: Institution) => {
        setSelectedMarker(institution);
        centerToMarker(institution);
        const convertedName = convertName(institution.name);
        window.history.pushState(null, '', `/maps/institutions?faculty=${convertedName}`);
    };

    const markers = useMemo(() => {
        const handleMarkerClick = (iwp: InstitutionWithProjects) => {
            setSelectedMarker(iwp);
            const convertedName = convertName(iwp.name);
            centerToMarker(iwp);
            window.history.pushState(null, '', `/maps/projects?faculty=${convertedName}`);
        };

        return institutionsWithProjects.map((iwp) => (
            <Marker
                key={iwp.id}
                longitude={iwp.longitude}
                latitude={iwp.latitude}
            >
                <Tooltip title={iwp.name} placement="top">
                    <LocationOnIcon
                        color="primary"
                        className="hover:scale-150 transition duration-300 ease-in-out cursor-pointer"
                        fontSize={markerSize}
                        onClick={() => handleMarkerClick(iwp)}
                        style={{ color: "darkorange", cursor: "pointer"}}
                    />
                </Tooltip>
            </Marker>
        ));
    }, [institutionsWithProjects, markerSize, mapRef]);

    return (
        <>
            <SearchBar institutions={institutionsWithProjects}
                       onSelectInstitution={handleSelectInstitution}
                       shifted={Boolean(selectedMarker)}
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
