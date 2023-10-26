import { Marker } from "react-map-gl";
import data from '../data/features.geojson'
import mapboxgl from "mapbox-gl";

type MappedDataItem = {
    name: string;
    coordinates: [number, number];
  };

const Locations = () => {
    
    const mappedData = data.features.map((feature:any) => ({
        name: feature.properties["Institution Name"],
        coordinates: feature.geometry.coordinates
      }));
    
    
    return (
        <>
        {mappedData.map((item: MappedDataItem, index: number) => (
            <Marker
              key={index}
              longitude={item.coordinates[0]}
              latitude={item.coordinates[1]}
              anchor="bottom"
            >
            </Marker>
          ))}
        </>
    );
}

export default Locations;