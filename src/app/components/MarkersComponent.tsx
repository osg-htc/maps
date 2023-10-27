import React, { useState } from "react";
import { Feature } from "../../../types/mapTypes";
import Sidebar from "./Sidebar";
import Markers from "./Markers";

const MarkersComponent: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<Feature | null>(null);

  const handleMarkerClick = (feature: Feature) => {
    setSelectedMarker(feature);
  };
  
  const closeSidebar = () => {
    setSelectedMarker(null);
  };

  return (
    <>
      <Markers onMarkerClick={handleMarkerClick} />
      {selectedMarker && <Sidebar feature={selectedMarker} onClose={closeSidebar} />}
    </>
  );
};

export default MarkersComponent;
