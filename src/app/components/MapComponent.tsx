import MarkersComponent from "./MarkersComponent";
import { Map } from "react-map-gl";
import { useRef, useState } from "react";
import MapControls from "./MapControllers";
const MapComponent = () => {
    const mapRef = useRef(null);
    const [projection, setProjection] = useState(true);
    const handleProjection = () => { {projection ? setProjection(false) : setProjection(true)};
    console.log(projection) };
    const viewState =({
        latitude: 39.8283,
        longitude: -98.5795,
        zoom: 4.5,
        width: '100%',
        height: '100vh',
    });

    if (projection) {
      return (
        <Map
          ref={mapRef}
          initialViewState={viewState}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          projection='globe'
        >
          <MapControls mapRef={mapRef} handleProjection={handleProjection} />
          <MarkersComponent/>
        </Map>
      );
    } else {
      return (
        <Map
          ref={mapRef}
          initialViewState={viewState}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          projection='mercator'
        >
          <MapControls mapRef={mapRef} handleProjection={handleProjection}/>
          <MarkersComponent/>
        </Map>
      );
    }
}

export default MapComponent;