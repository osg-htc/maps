import React, { useState } from "react";
import { Feature, TypedFeatures } from "../../../types/mapTypes";
import Sidebar from "./Sidebar";
import Markers from "./Markers";
import { useNavigate } from "react-router-dom";

const MarkersComponent: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<TypedFeatures | null>(null);
  const [facultyName, setFacultyName] = useState<string>("");
  const navigate = useNavigate();

  const handleMarkerClick = (feature: Feature) => {
    setSelectedMarker(feature);
    convertName(feature);
    navigate(`?faculty=${facultyName}`);
  };

  const convertName = (feature: Feature) => {
    const originalName = feature.properties["Institution Name"];
    const convertedName = encodeURIComponent(originalName);
    setFacultyName(convertedName);
};


  const closeSidebar = () => {
    setSelectedMarker(null);
    navigate(``);
  };

  return (
    <>
      <Markers onMarkerClick={handleMarkerClick} />
      {selectedMarker && <Sidebar facultyName={facultyName} onClose={closeSidebar} header={selectedMarker.properties["Institution Name"]} dataState={selectedMarker.dataState}/>}
    </>
  );
};

export default MarkersComponent;
