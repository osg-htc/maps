

type MarkersProps = {
  mapRef: React.RefObject<any>;
  zoom: number;
};

interface ProjectWithESData {
  id: number;
  Name: string;
  Department: string;
  FieldOfScience: string;
  PIName: string;
  InstitutionID: number;
  esData?: {
    docCount: number;
    cpuHours: number;
    gpuHours: number;
    jobsRan: number;
  };
}

type InstitutionWithProjects = Institution & {
  projects: ProjectWithESData[];
};

type SidebarProps = {
  onClose: () => void;
  header: string;
  facultyName: string;
  dataState?: boolean;
  website?: string;
};

type SearchBarProps = {
  institutions: Institution[];
  onSelectInstitution: (institution: Institution) => void;
  shifted?: boolean;
}

type GrafanaPanelProps = {
  panelId: number;
  panelUrl: string;
  start: number;
  end: number;
  orgId: number;
  facultyName: string;
};

interface ProjectWithESData extends ProjectWithESData{
  name: string;
  ID: string;
  Department: string;
  Description: string;
  FieldOfScience: string;
  FieldOfScienceID: string;
  Organization: string;
  PIName: string;
  ResourceAllocations: any;
  Sponsor: {
    CampusGrid: {
      ID: number;
      Name: string;
    };
  };
  esData: {
    docCount: number;
    cpuHours: number;
    gpuHours: number;
    jobsRan: number;
  };
};

interface Facility {
  name: string;
  ID: number;
  isCCStar: boolean;
  esData: [] | null;
}

interface FacilityInfo {
  InstitutionID: string;
  ID: number;
  IsCCStar: boolean;
}


interface Institution{
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  facilities: Facility[];
  ipeds_metadata: {
    control: string;
    historically_black_college_or_university: boolean,
    institution_size: string,
    program_length: string,
    state: string,
    tribal_college_or_university: boolean,
    website_address: string
  }
}

export type {
  Facility,
  FacilityInfo,
  Institution,
  MarkersProps,
  SidebarProps,
  SearchBarProps,
  GrafanaPanelProps,
  ProjectWithESData,
  ProjectWithESData,
    InstitutionWithProjects,
};