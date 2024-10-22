import React, { CSSProperties } from 'react';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NorthIcon from '@mui/icons-material/Explore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MapIcon from '@mui/icons-material/Map';

interface MapControlsProps {
  mapRef: React.RefObject<any>;
  handleProjection: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  mapRef,
  handleProjection,
}) => {
  const controlStyles: CSSProperties = {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // 50% white background
    borderRadius: '8px', // Rounded corners
    padding: '3px', // Some padding around the buttons
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Optional: a subtle shadow for depth
  };

  const runningInIframe = window.location !== window.parent.location;

  const openInBrowser = () => {
    window.open('https://osg-htc.org/maps/', '_blank');
  };
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
      zoom: 1,
      bearing: 0,
      pitch: 0,
      duration: 2000,
    });
  };

  return (
    <>
      {runningInIframe ? (
        <div style={controlStyles}>
          <IconButton onClick={openInBrowser}>
            <OpenInNewIcon />
          </IconButton>
        </div>
      ) : (
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
      )}
    </>
  );
};

export default MapControls;
