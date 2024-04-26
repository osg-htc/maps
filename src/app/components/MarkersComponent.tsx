import React, { useState, useEffect, useMemo } from "react";
import { Marker } from "react-map-gl";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from "@mui/material";
import { Feature, TypedFeatures, MarkersProps } from "../../../types/mapTypes";
import Features from "../../../public/features.json";
import Projects from "../../../public/projects.json";
import esProjects from "../projects/esProjects";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MarkersComponent: React.FC<MarkersProps> = ({ mapRef, zoom }) => {
  const [markerSize, setMarkerSize] = useState<any>("small");
  const [selectedMarker, setSelectedMarker] = useState<TypedFeatures | null>(null);
  const [facultyName, setFacultyName] = useState<string>("");
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [elasticsearchProjects, setElasticsearchProjects] = useState([]);
  useEffect(() => {
    const zoomRate = (zoom:number) => { 
        if (zoom < 3) {
          setMarkerSize("small");
        } else {
          setMarkerSize("large");
        }
      }
      zoomRate(zoom);
    }, [zoom]);

    useEffect(() => {
      const fetchInstitutions = async () => {
        try {
          const response = await axios.get('/api/institution_ids');
          const data = response.data; // Access the data property of the response object
          setInstitutions(data);  // This updates the institutions state
        } catch (error) {
          console.error('Failed to fetch institutions:', error);
        }
      };
      
      const fetchProjects = async () => {
        try {
          const response = await esProjects();
          const data = response.aggregations.projects.buckets
          setElasticsearchProjects(data);
          console.log(elasticsearchProjects)
        } catch (error) {
          console.error('Failed to fetch projects:', error);
        }
      };

      fetchProjects();
      fetchInstitutions();
    }, []);

  const institutionsWithProjects = useMemo(() => {
    return institutions.reduce((acc, institution) => {
      // Using the institution's name to match with the project's organization
      const institutionName = institution.name;
      const institutionProjects = Object.entries(Projects)
        .filter(([, project]) => project.Organization === institutionName)
        .map(([, project]) => project);

      if (institutionProjects.length > 0) {
        acc[institutionName] = institutionProjects;
      }

      return acc;
    }, {});
  }, [institutions]);

  const handleResetNorth = () => {
    const map = mapRef.current.getMap();
    map.flyTo({
      zoom: 4.5,
      duration: 2000,
    });
  };

  const convertName = (feature: Feature) => {
    const originalName = feature.properties["Institution Name"];
    const convertedName = encodeURIComponent(originalName);
    setFacultyName(convertedName);
    return convertedName;
  };

  const closeSidebar = () => {
    navigate(`/maps`);
    setSelectedMarker(null);
    handleResetNorth();
  };

  const markers = useMemo(() => {
    const handleMarkerClick = (feature: Feature) => {
        setSelectedMarker(feature);
        const convertedName = convertName(feature); 
        centerToMarker(feature);
        navigate(`/maps?faculty=${convertedName}`);
    };

    const centerToMarker = (feature: Feature) => {
      const map = mapRef.current.getMap();
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 8,
          duration: 2000,
        });
      };

      const institutionNames = institutions.map(institution => institution.name);      
      const matchedFeatures = Features.features
        .filter(feature => institutionNames.includes(feature.properties["Institution Name"])); // Keep only features that have a matching name in institutionNames
      
      // Now create markers for matched features
      return matchedFeatures.map((feature) => {
        const institutionName = feature.properties["Institution Name"];
      
        // Create the feature object, now assured it's one of the institutions we want to display
        const filteredFeature: TypedFeatures = {
          type: feature.type,
          properties: {
            "Institution Name": institutionName,
          },
          geometry: {
            type: feature.geometry.type,
            coordinates: [
              feature.geometry.coordinates[0],
              feature.geometry.coordinates[1]
            ] as [number, number]
          },
          id: feature.id,
        };
      
      return (
        <Marker
          key={filteredFeature.id}
          longitude={filteredFeature.geometry.coordinates[0]}
          latitude={filteredFeature.geometry.coordinates[1]}
        >
          <Tooltip title={filteredFeature.properties["Institution Name"]} placement="top">
          <LocationOnIcon 
            color="primary"
            className="hover:scale-150 transition duration-300 ease-in-out cursor-pointer"
            fontSize={markerSize} onClick={() => handleMarkerClick(filteredFeature)} />
          </Tooltip>
        </Marker>
      );
    });
  }, [markerSize, navigate, mapRef, institutions]);

  return (
    <>
      {markers}
      {selectedMarker && 
      <Sidebar
      facultyName={facultyName}
      onClose={closeSidebar}
      header={selectedMarker.properties["Institution Name"]}
      projects={institutionsWithProjects[selectedMarker.properties["Institution Name"]] || []}
      dataState={selectedMarker.dataState}
      />
      }
    </>
  );
};

export default MarkersComponent;
