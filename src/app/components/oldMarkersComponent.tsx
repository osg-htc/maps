import React, { useState } from "react";
import { Feature, TypedFeatures } from "../../../types/mapTypes";
import Sidebar from "./Sidebar";
import Markers from "./oldMarkers";
import { useNavigate } from "react-router-dom";

type MarkersComponentProps = {
  mapRef: React.RefObject<any>;
  zoom: number;
};

const MarkersComponent: React.FC<MarkersComponentProps> = ({mapRef}, zoom) => {
  const [selectedMarker, setSelectedMarker] = useState<TypedFeatures | null>(null);
  const [facultyName, setFacultyName] = useState<string>("");
  const navigate = useNavigate();

  const centerToMarker = (feature: Feature) => {
    const map = mapRef.current.getMap();
    map.flyTo({
      center: feature.geometry.coordinates,
      zoom: 8,
      duration: 2000,
    });
  };

  const handleMarkerClick = (feature: Feature) => {
    setSelectedMarker(feature);
    const convertedName = convertName(feature); 
    centerToMarker(feature);
    navigate(`/maps?faculty=${convertedName}`);
};

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

  return (
    <>
      <Markers onMarkerClick={handleMarkerClick} zoom={zoom} />
      {selectedMarker && <Sidebar facultyName={facultyName} onClose={closeSidebar} header={selectedMarker.properties["Institution Name"]} dataState={selectedMarker.dataState}/>}
    </>
  );
};

export default MarkersComponent;
