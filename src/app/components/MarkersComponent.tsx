import React, { useState, useEffect, useMemo } from "react";
import { Marker } from "react-map-gl";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from "@mui/material";
import { Feature, TypedFeatures } from "../../../types/mapTypes";
import Features from "../../../public/features.json";
import { getFacilityEsData } from "@/app/institutions/elasticQuery.js";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

type UnifiedMarkersProps = {
  mapRef: React.RefObject<any>;
  zoom: number;
};

const UnifiedMarkersComponent: React.FC<UnifiedMarkersProps> = ({ mapRef, zoom }) => {
  const [esData, setEsData] = useState<any>({});
  const [markerSize, setMarkerSize] = useState<any>("small");
  const [selectedMarker, setSelectedMarker] = useState<TypedFeatures | null>(null);
  const [facultyName, setFacultyName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const zoomRate = (zoom:number) => { 
        if (zoom < 3) {
          setMarkerSize("small");
        } else {
          setMarkerSize("large");
        }
      }
      // Fetch the ElasticSearch data when the component mounts
      const fetchData = async () => {
        const data = await getFacilityEsData();
        setEsData(data);
      };
  
      fetchData();
      zoomRate(zoom);
    }, [zoom]);

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
    const esDataInstitutions = Object.keys(esData);
    const featuresInstitutions = Features.features.map(feature => feature.properties["Institution Name"]);
    const unmatchedInstitutions = esDataInstitutions.filter(institution => !featuresInstitutions.includes(institution));
    return Features.features.map((feature) => {
      const institutionName = feature.properties["Institution Name"];
      const esInfo = esData[institutionName];

      if (!esInfo) {
        // Handle cases where there's no matching institution in the ElasticSearch data.

        return null;
      }


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
        dataState: esInfo.gpuProvided > 0
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
  }, [esData, markerSize, navigate, mapRef]);

  return (
    <>
      {markers}
      {selectedMarker && <Sidebar facultyName={facultyName} onClose={closeSidebar} header={selectedMarker.properties["Institution Name"]} dataState={selectedMarker.dataState}/>}
    </>
  );
};

export default UnifiedMarkersComponent;
