import React, { useState } from "react";
import { Feature, TypedFeatures } from "../../../types/mapTypes";
import Sidebar from "./Sidebar";
import Markers from "./Markers";

const MarkersComponent: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<TypedFeatures | null>(null);
  const [facultyName, setFacultyName] = useState<string>("");

  const handleMarkerClick = (feature: Feature) => {
    setSelectedMarker(feature);
    convertName(feature);
  };

  const convertName = (feature: Feature) => {
    const originalName = feature.properties["Institution Name"];
    const convertedName = originalName.replace(/\s+/g, '+');
    setFacultyName(convertedName);
  };

  const closeSidebar = () => {
    setSelectedMarker(null);
  };

  return (
    <>
      <Markers onMarkerClick={handleMarkerClick} />
      {selectedMarker && <Sidebar facultyName={facultyName} onClose={closeSidebar} header={selectedMarker.properties["Institution Name"]} dataState={selectedMarker.dataState}/>}
    </>
  );
};

export default MarkersComponent;
