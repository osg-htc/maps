import React, { useRef} from 'react';
import { Map, Marker } from 'react-map-gl';
import MapControls from './MapControls';
import MapPopup from './MapPopup';
import Locations from './Locations';

const MapComponent = () => {
  const mapRef = useRef(null);

  const viewState =({
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 2,
    width: '100%',
    height: '100vh',
  });

  return (
  <>
    <Map
      ref={mapRef}
      initialViewState={viewState}
      mapStyle='mapbox://styles/abakirci/clo7fg1d400ll01pbdly3arx8'
      mapboxAccessToken='pk.eyJ1IjoiYWJha2lyY2kiLCJhIjoiY2xub3NtbHp0MDR2bDJ6bnc4bWt2ZjlzcCJ9.wGS87zkq2AG2TQgB3OwoHw'
    >
      <MapControls mapRef={mapRef} />
      <MapPopup mapRef={mapRef}/>
      <Locations />
    </Map>
  </>
  );
};

export default MapComponent;