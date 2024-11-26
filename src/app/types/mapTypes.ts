

type MarkersProps = {
  mapRef: React.RefObject<any>;
  zoom: number;
};

export interface TopologyProject {
  Department: string;
  Description: string;
  FieldOfScience: string;
  FieldOfScienceID: string;
  ID: string;
  InstitutionID: string;
  Name: string;
  Organization: string;
  PIName: string;
  ResourceAllocations: any;
  Sponsor: {
    CampusGrid: {
      ID: number;
      Name: string;
    };
  };
}

export interface EsProject {
  key: string;
  doc_count: number;
  projectJobsRan: {
    value: number;
  };
  projectGpuUse: {
    value: number;
  };
  projectCpuUse: {
    value: number;
  };
}

interface Project {
  id: number;
  Name: string;
  Department: string;
  FieldOfScience: string;
  PIName: string;
  InstitutionID: number;
  esData?: EsData
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

interface ProjectWithESData extends TopologyProject{
  esData: EsData
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
  id: string;
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

interface EsData {
  docCount: number;
  cpuHours: number;
  gpuHours: number;
  jobsRan: number;
}

type EsDataType = Record<string, EsData>;

type FetcherKey = 'facilities' | 'institutions' | 'esData';

export type {
  Facility,
  FacilityInfo,
  Institution,
  MarkersProps,
  SidebarProps,
  SearchBarProps,
  GrafanaPanelProps,
  Project,
  ProjectWithESData,
    InstitutionWithProjects,
    FetcherKey,
    EsData,
    EsDataType
};