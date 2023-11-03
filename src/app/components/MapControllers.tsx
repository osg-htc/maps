import React, { CSSProperties } from 'react';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NorthIcon from '@mui/icons-material/Explore';
import MapIcon from '@mui/icons-material/Map';


interface MapControlsProps {
    mapRef: React.RefObject<any>;
    handleProjection: () => void;
  }

const MapControls: React.FC<MapControlsProps> = ({ mapRef, handleProjection }) => {
  const handleZoomIn = () => {
    const map = mapRef.current.getMap();
    map.zoomIn();
  };

  const handleZoomOut = () => {
    const map = mapRef.current.getMap();
    map.zoomOut();
  };

  const handleResetNorth = () => {
    const map = mapRef.current.getMap();
    map.flyTo({
      center: [-98.5795, 39.8283],
      zoom: 4.5,
      bearing: 0,
      pitch: 0,
      duration: 2000,
    });
  };

  const controlStyles: CSSProperties = {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };
  

  return (
    <div style={controlStyles}>
      <IconButton onClick={handleZoomIn}>
        <ZoomInIcon />
      </IconButton>
      <IconButton onClick={handleZoomOut}>
        <ZoomOutIcon />
      </IconButton>
      <IconButton onClick={handleResetNorth}>
        <NorthIcon />
      </IconButton>
      <IconButton onClick={handleProjection}>
        <MapIcon />
      </IconButton>
    </div>
  );
};

export default MapControls;