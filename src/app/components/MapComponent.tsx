import MarkersComponent from "./Markers";
import { Map } from "react-map-gl";
import { useRef } from "react";
import MapControls from "./MapControllers";

const MapComponent = () => {
    const mapRef = useRef(null);

    const viewState =({
        latitude: 39.8283,
        longitude: -98.5795,
        zoom: 3,
        width: '100%',
        height: '100vh',
    });

    return (
        <Map
          ref={mapRef}
          initialViewState={viewState}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          projection={"globe"}
        >
          <MapControls mapRef={mapRef}/>
          <MarkersComponent/>
        </Map>
    );
}

export default MapComponent;