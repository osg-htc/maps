import React, { useState, useEffect, useMemo } from 'react';
import { Marker } from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from '@mui/material';
import esProjects from '../../data/esProjects';
import Sidebar from './Sidebar';
import {useRouter, useSearchParams} from "next/navigation";

type Project = {
  key: string;
  doc_count: number;
  projectCpuUse: { value: number };
  projectGpuUse: { value: number };
  projectJobsRan: { value: number };
  Organization: string;
  Name: string;
};

const MarkersComponent: React.FC< {mapRef: any} > = ({ mapRef }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [markerSize, setMarkerSize] = useState<any>('small');
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [facultyName, setFacultyName] = useState<string>('');
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [projects, setProjects] = useState<any>([]);
  const [elasticsearchProjects, setElasticsearchProjects] = useState<Project[]>(
    []
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const currentZoom = map.getZoom();
    //console.log('Current zoom:', currentZoom);

    const newSize = currentZoom < 3 ? 'small' : 'large';
    if (markerSize !== newSize) {
      setMarkerSize(newSize);
    }
  }, [mapRef, markerSize]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch(
          'https://topology-institutions.osg-htc.org/api/institution_ids'
        );
        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error('Failed to fetch institutions:', error);
      }
    };

    const fetchProjects = async() => {
      try{
        const response = await fetch('https://topology.opensciencegrid.org/miscproject/json')
        const data = await response.json();
        setProjects(data);
        console.log('Projects:', data);
      } catch (error){
        console.error('Failed to fetch projects:', error);
      }
    }

    const fetchElasticsearchProjects = async () => {
      try {
        const response = await esProjects();
        setElasticsearchProjects(response.aggregations.projects.buckets);
        console.log('Elasticsearch projects:', response.aggregations.projects.buckets);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
    fetchInstitutions();
    fetchElasticsearchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const projectNames = new Set(
      elasticsearchProjects.map((project) => project.key)
    );
    return Object.values(projects).filter((project) =>
      projectNames.has(project.Name)
    );
  }, [elasticsearchProjects, projects])

  console.log('Filtered projects:', filteredProjects);

  const institutionsWithProjects = useMemo(() => {
    return institutions.reduce((acc, institution) => {
      const institutionId = institution.id;
      const institutionProjects = filteredProjects
          .filter((project) => project.InstitutionID === institutionId)
          .map((proj) => {
            const projectData = elasticsearchProjects.find((elProj) => elProj.key === proj.Name);
            return {
              ...proj,
              cpuHours: projectData?.projectCpuUse.value || 0,
              gpuHours: projectData?.projectGpuUse.value || 0,
            };
          });

      if (institutionProjects.length > 0) {
        acc[institution.name] = institutionProjects;
      }

      return acc;
    }, {});
  }, [institutions, filteredProjects, elasticsearchProjects]);

    console.log('Institutions with projects:', institutionsWithProjects);



  const centerToMarker = (institution: any) => {
    const map = mapRef.current.getMap();
    map.flyTo({
      center: [institution.longitude, institution.latitude],
      zoom: 8,
      duration: 2000,
    });
  };

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
    router.push(`/projects`);
    setSelectedMarker(null);
    handleResetNorth();
  };

  const markers = useMemo(() => {
    const handleMarkerClick = (institution: any, institutionName: any) => {
      setSelectedMarker(institution);
      const convertedName = convertName(institutionName);
      centerToMarker(institution);
      router.push(`/projects?faculty=${convertedName}`);
    };
    // Now create markers for matched features
    return institutions
        .filter((institution) => institutionsWithProjects[institution.name])
        .map((institution) => (
            <Marker
                key={institution.id}
                longitude={institution.longitude}
                latitude={institution.latitude}
            >
              <Tooltip title={institution.name} placement="top">
                <LocationOnIcon
                    color="primary"
                    className="hover:scale-150 transition duration-300 ease-in-out cursor-pointer"
                    fontSize={markerSize}
                    onClick={() => handleMarkerClick(institution, institution.name)}
                />
              </Tooltip>
            </Marker>
        ));
  }, [institutionsWithProjects, markerSize, mapRef]);


  return (
    <>
      {markers}
      {selectedMarker && (
          <Sidebar
              facultyName={facultyName}
              onClose={closeSidebar}
              header={selectedMarker.name} // Ensure this is a string
              projects={institutionsWithProjects[selectedMarker.name] || []} // Ensure this is an array
              dataState={selectedMarker} // Check if this is necessary
              selectedMarker={selectedMarker} // Check if this is necessary
          />
      )}
    </>
  );
};

export default MarkersComponent;
