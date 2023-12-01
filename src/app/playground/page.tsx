'use client'
import React, { useRef, useState } from 'react';
import Map, { MapRef } from 'react-map-gl';
import UnifiedMarkersComponent from '../components/MarkersComponent';
import MapControls from '../components/MapControllers';

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface MapMoveEvent {
  viewState: ViewState;
}

const NewMarkers: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const mapRef = useRef<MapRef>(null);
  const [projection, setProjection] = useState('globe');
  
  const handleProjection = () => {
    setProjection(projection === 'globe' ? 'mercator' : 'globe');
  };

  const viewState = {
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: zoom,
    width: '100%',
    height: '100vh',
    transitionDuration: 300 
  };

  const onMove = (event: MapMoveEvent) => {
    setZoom(event.viewState.zoom);
    console.log(zoom);
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={viewState}
      onMove={onMove}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      projection={projection}
    >
      <MapControls mapRef={mapRef} handleProjection={handleProjection} />
      <UnifiedMarkersComponent mapRef={mapRef} zoom={zoom}/>
    </Map>
  );
};

export default NewMarkers;
