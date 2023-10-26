import React, { useState, useEffect } from 'react';
import { Popup } from 'react-map-gl';
import { Popover } from '@mui/material';

type PopoverInfo = {
    longitude: number;
    latitude: number;
    name: string;
  } | null;
interface MapPopupProps {
mapRef: React.RefObject<any>; // specify the type of mapRef
}

const MapPopup:React.FC<MapPopupProps> = ({ mapRef }) => {
const [popoverInfo, setPopoverInfo] = useState<PopoverInfo>(null);

const handleMapClick = (event:any) => {
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(event.point, {
      layers: ['institutions']  // replace with your layer name
    });
  
    if (!features.length) {
      return;
    }
  
    const feature = features[0];
  
    if (feature.geometry.type === 'Point' && feature.properties) {
      const name = feature.properties["Institution Name"];
      const coordinates: [number, number] = feature.geometry.coordinates as [number, number];
      const longitude = coordinates[0];
      const latitude  = coordinates[1];
      setPopoverInfo({ longitude, latitude, name });
      console.log("it;s working")
    }
  };  

useEffect(() => {
    // Add the handleMapClick function as a click event listener on the map
    const map = mapRef.current.getMap();
    map.on('click', handleMapClick);
    return () => {
    // Remove the handleMapClick function as a click event listener when the component unmounts
    map.off('click', handleMapClick);
    };
}, [mapRef]);

return (
    <>
    {popoverInfo && (
        <Popover>{popoverInfo.name}</Popover>
    )}
    </>
);
};

export default MapPopup;



