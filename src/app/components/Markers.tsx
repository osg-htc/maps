import React, { useMemo } from "react";
import { Marker } from "react-map-gl";
import { School } from "@mui/icons-material";
import { Feature } from "../../../types/mapTypes";
import Features from "../../../public/features.json";

type MarkersProps = {
  onMarkerClick: (feature: Feature) => void;
};

const Markers: React.FC<MarkersProps> = ({ onMarkerClick }) => {
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
          <School fontSize="small" onClick={() => onMarkerClick(typedFeature)} />
        </Marker>
      );
    });
  }, [onMarkerClick]);

  return <>{markers}</>;
};

export default Markers;