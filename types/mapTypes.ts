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
    Department: string;
    Description: string;
    FieldOfScience: string;
    FieldOfScienceID: string;
    ID: string;
    InstitutionID: string;
    Name: string;
    Organization: string;
    PIName: string;
    ResourceAllocations: null | any; 
    Sponsor: {
      CampusGrid: {
        ID: number;
        Name: string;
      };
    };
  };