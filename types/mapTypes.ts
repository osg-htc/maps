// mapTypes.ts
export type Geometry = {
    coordinates: [number, number];
    type: string;
  };
  
  export type Properties = {
    "Institution Name": string;
  };
  
  export type Feature = {
    type: string;
    properties: Properties;
    geometry: Geometry;
    id: string;
  };
  
  export type FeaturesType = {
    features: Feature[];
  };
  
  export type TypedFeatures = Feature & {
    dataState?: boolean;
  }

  export type MarkersProps = {
    mapRef: React.RefObject<any>;
    zoom: number;
  };

  export type Project = {
    Name: string;
    Department: string;
    FieldOfScience: string;
    PIName: string;
    cpuHours: number;
    gpuHours: number;
  }

  export type Institution = {
    id: number;
    name: string;
    };