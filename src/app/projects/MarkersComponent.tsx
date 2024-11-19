import React, { useState, useEffect, useMemo } from 'react';
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
import useSWR from 'swr';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 0,
        top: 5,
        padding: '0 4px',
        backgroundColor: 'black',
        color: 'white',
    },
}));

const fetcher = (key: string) => {
    if (key === 'projects') {
        return fetch('https://topology.opensciencegrid.org/miscproject/json').then((res) => res.json());
    } else if (key === 'institutions') {
        return fetch('https://topology-institutions.osg-htc.org/api/institution_ids').then((res) => res.json());
    } else if (key === 'esProjects') {
        return fetchElasticsearchProjects();
    }
    throw new Error(`Unknown key: ${key}`);
};

const fetchElasticsearchProjects = async () => {
    const response = await esProjects();
    return response.aggregations.projects.buckets;
};

const MarkersComponent: React.FC<{
    institutions: Institution[];
    projects: Project[];
    elasticsearchProjects: any[];
    mapRef: any;
}> = ({ institutions: initialInstitutions, projects: initialProjects, elasticsearchProjects: initialElasticsearchProjects, mapRef }) => {

    const { data: institutions } = useSWR('institutions', fetcher, {
        fallbackData: initialInstitutions,
    });

    let { data: projects } = useSWR('projects', fetcher, {
        fallbackData: initialProjects,
    });

    let { data: elasticsearchProjects } = useSWR('esProjects', fetcher, {
        fallbackData: initialElasticsearchProjects
    });

    const searchParams = useSearchParams()
    const faculty = searchParams.get('faculty');
    const [markerSize, setMarkerSize] = useState<'small' | 'large'>('small');
    const [selectedMarker, setSelectedMarker] = useState<InstitutionWithProjects | null>(null);
    const [facultyName, setFacultyName] = useState<string>('');
    const [currentZoom, setCurrentZoom] = useState<number>(0);

    projects = useMemo(() => {
        if (!projects) return [];
        if (Array.isArray(projects)) {
            return projects;
        } else if (typeof projects === 'object' && projects !== null) {
            return Object.values(projects);
        } else {
            console.error('Unexpected projectsData format:', projects);
            return [];
        }
    }, [projects]);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current.getMap();
        const handleZoom = () => {
            const zoom = map.getZoom();
            setCurrentZoom(zoom); // Update zoom level state
            const newSize = zoom < 3 ? 'small' : 'large';
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

    useEffect(() => {
        const handleUrlChange = () => {
            const currentPath = window.location.pathname;
            if (currentPath === '/maps' || currentPath === '/maps/institutions' || currentPath === '/maps/projects') {
                handleResetNorth();
                closeSidebar();
            }
        };

        handleUrlChange();

        window.addEventListener('popstate', handleUrlChange); // detect back/forward button clicks / url changes

        return () => {
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, []);

    const filteredProjects = useMemo(() => {
        const projectNames = new Set(
          (elasticsearchProjects || []).map((project: Project) => project.key)
        );
        return (projects || []).filter((project: Project) => projectNames.has(project.Name));
    }, [elasticsearchProjects, projects]);

    const institutionsWithProjects: InstitutionWithProjects[] = useMemo(() => {
        return (institutions || []).map((institution: Institution) => {
            const institutionProjects: ProjectWithESData[] = filteredProjects
              .filter((project: Project) => project.InstitutionID === institution.id)
              .map((proj: Project) => {
                  const projectData = (elasticsearchProjects || []).find((elProj: Project) => elProj.key === proj.Name);
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
        }).filter((iwp: { projects: string | any[]; }) => iwp.projects.length > 0);
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
        const handleMarkerClick = (institution: InstitutionWithProjects) => {
            setSelectedMarker(institution);
            const convertedName = convertName(institution.name);
            centerToMarker(institution);
            window.history.pushState(null, '', `/maps/projects?faculty=${convertedName}`);
        };

        return institutionsWithProjects.map((institution) => (

            <Marker
                key={institution.id}
                longitude={institution.longitude}
                latitude={institution.latitude}
            >
                {currentZoom >= 3 && (
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
                {currentZoom < 3 && (
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
    }, [institutionsWithProjects, markerSize, mapRef]);

    return (
        <>
            <SearchBar institutions={institutionsWithProjects}
                       onSelectInstitution={handleSelectInstitution}
                       shifted={Boolean(selectedMarker)}
            />
            <DataCard numberOfInstitutions={institutionsWithProjects.length} shifted={Boolean(selectedMarker)} numberOfProjects={filteredProjects.length}/>
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
