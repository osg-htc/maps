
import React, { useMemo, useRef, useState } from 'react';
import Map, { MapRef } from 'react-map-gl';
import MarkersComponent from './MarkersComponent';
import MapControls from './MapControllers';
import { Institution, InstitutionWithProjects, ProjectWithESData } from '@/app/types/mapTypes';

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

const MapComponent: React.FC<{
  institutionsWithProjects: InstitutionWithProjects[]
}> = ({institutionsWithProjects}) => {
  const mapRef = useRef<MapRef>(null);
  const [projection, setProjection] = useState('globe');

  const handleProjection = () => {
    setProjection(projection === 'globe' ? 'mercator' : 'globe');
  };

  const viewState = {
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 1,
    width: '100%',
    height: '100vh',
    transitionDuration: 300,
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={viewState}
      mapStyle='mapbox://styles/mapbox/streets-v11'
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      projection={projection}
    >
      <MapControls mapRef={mapRef} handleProjection={handleProjection} />
      <MarkersComponent institutionsWithProjects={institutionsWithProjects} mapRef={mapRef}/>
    </Map>
  );
};

export default MapComponent;
