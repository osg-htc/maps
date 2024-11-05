import React, { useState, useEffect, useMemo } from 'react';
import { Marker } from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from '@mui/material';
import { Feature, TypedFeatures, MarkersProps } from '../types/mapTypes';
import Institutions from '../../data/features.json';
import Projects from '../../data/projects.json';
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

const MarkersComponent: React.FC<MarkersProps> = ({ mapRef }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [markerSize, setMarkerSize] = useState<any>('small');
  const [selectedMarker, setSelectedMarker] = useState<TypedFeatures | null>(
    null
  );
  const [facultyName, setFacultyName] = useState<string>('');
  const [institutions, setInstitutions] = useState<any[]>([]);
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
    const fetchProjects = async () => {
      try {
        const response = await esProjects();
        setElasticsearchProjects(response.aggregations.projects.buckets);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchInstitutions();
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const projectNames = new Set(
      elasticsearchProjects.map((project) => project.key)
    );
    return Object.values(Projects).filter((project) =>
      projectNames.has(project.Name)
    );
  }, [elasticsearchProjects]);

  console.log('filteredProjects:', filteredProjects);

  const institutionsWithProjects = useMemo(() => {
    return institutions.reduce((acc, institution) => {
      const institutionName = institution.name;
      const institutionProjects = filteredProjects
        .filter((project) => project.Organization === institutionName)
        .map((proj) => {
          const projectData = elasticsearchProjects.find(
            (elProj) => elProj.key === proj.Name
          );
          return {
            ...proj,
            cpuHours: projectData?.projectCpuUse.value || 0,
            gpuHours: projectData?.projectGpuUse.value || 0,
          };
        });

      if (institutionProjects.length > 0) {
        acc[institutionName] = institutionProjects;
      }

      return acc;
    }, {});
  }, [institutions, filteredProjects, elasticsearchProjects]);

  const handleResetNorth = () => {
    const map = mapRef.current.getMap();
    map.flyTo({
      zoom: 4.5,
      duration: 2000,
    });
  };

  const convertName = (feature: Feature) => {
    const originalName = feature.properties['Institution Name'];
    const convertedName = encodeURIComponent(originalName);
    setFacultyName(convertedName);
    return convertedName;
  };

  const closeSidebar = () => {
    router.push(`/projects`);
    setSelectedMarker(null);
    handleResetNorth();
  };

  const markers = useMemo(() => {
    const handleMarkerClick = (feature: Feature) => {
      setSelectedMarker(feature);
      const convertedName = convertName(feature);
      centerToMarker(feature);
      router.push(`/projects?faculty=${convertedName}`);
    };

    const centerToMarker = (feature: Feature) => {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: feature.geometry.coordinates,
        zoom: 8,
        duration: 2000,
      });
    };

    const matchedFeatures = Institutions.features.filter(
      (feature) =>
        institutionsWithProjects[feature.properties['Institution Name']]
    );

    // Now create markers for matched features
    return matchedFeatures.map((feature) => {
      const institutionName = feature.properties['Institution Name'];

      // Create the feature object, now assured it's one of the institutions we want to display
      const filteredFeature: TypedFeatures = {
        type: feature.type,
        properties: {
          'Institution Name': institutionName,
        },
        geometry: {
          type: feature.geometry.type,
          coordinates: [
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1],
          ] as [number, number],
        },
        id: feature.id,
      };

      return (
        <Marker
          key={filteredFeature.id}
          longitude={filteredFeature.geometry.coordinates[0]}
          latitude={filteredFeature.geometry.coordinates[1]}
        >
          <Tooltip
            title={filteredFeature.properties['Institution Name']}
            placement='top'
          >
            <LocationOnIcon
              color='primary'
              className='hover:scale-150 transition duration-300 ease-in-out cursor-pointer'
              fontSize={markerSize}
              onClick={() => handleMarkerClick(filteredFeature)}
            />
          </Tooltip>
        </Marker>
      );
    });
  }, [markerSize, mapRef, institutionsWithProjects]);

  return (
    <>
      {markers}
      {selectedMarker && (
        <Sidebar
          facultyName={facultyName}
          onClose={closeSidebar}
          header={selectedMarker.properties['Institution Name']}
          projects={
            institutionsWithProjects[
              selectedMarker.properties['Institution Name']
            ] || []
          }
          dataState={selectedMarker.dataState}
          selectedMarker={selectedMarker.properties['Institution Name']}
        />
      )}
    </>
  );
};

export default MarkersComponent;
