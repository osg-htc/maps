import React, { useMemo, useState } from "react";
import { Marker, Popup } from "react-map-gl";
import Features from "../../../public/features.json";
import { School } from "@mui/icons-material";
import { Feature } from "../../../types/mapTypes";


const MarkersComponent: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<Feature | null>(null);

  const handleMarkerClick = (feature: Feature) => {
    setSelectedMarker(feature);
  };

  const markers = useMemo(() => {
    return Features.features.map((feature) => {
      const typedFeature: Feature = {
        type: feature.type,
        properties: {
          "Institution Name": feature.properties["Institution Name"]
        },
        geometry: {
          type: feature.geometry.type,
          coordinates: [
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1]
          ] as [number, number]
        },
        id: feature.id
      };

      return (
        <Marker
          key={typedFeature.id}
          longitude={typedFeature.geometry.coordinates[0]}
          latitude={typedFeature.geometry.coordinates[1]}
        >
          <School fontSize="small" onClick={() => handleMarkerClick(typedFeature)} />
        </Marker>
      );
    });
  }, [Features]);

  return (
    <>
      {markers}
      {selectedMarker && (
        <Popup
          longitude={selectedMarker.geometry.coordinates[0]}
          latitude={selectedMarker.geometry.coordinates[1]}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setSelectedMarker(null)}
          anchor="top"
        >
          <div>{selectedMarker.properties["Institution Name"]}</div>
        </Popup>
      )}
    </>
  );
};

export default MarkersComponent;
