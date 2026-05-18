'use client'

import { Badge, Box, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { getProjectOverview, getProjects, InstitutionData, ProjectData } from '@/src/utils/adstash';
import Sidebar from '../Sidebar';
import ProjectPins from "./ProjectPins"
import InstitutionPins from "./InstitutionPins"
import ProjectStats from "./ProjectStats"
import ProjectListCard from './ProjectListCard';
import ProjectInstitutionListCard from './ProjectInstitutionListCard';
import { addSpacesToUnderscores } from '@/src/utils/helpers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Legend from '../Legend';
import { FilterAlt } from '@mui/icons-material';
import DropdownPopover from '../DropdownPopover';
import InstitutionFilterMenu, { ClassificationFilterMode, StateFilterMode } from '../InstitutionFilterMenu';
import LoadingScreen from '../LoadingScreen';
import useSWR from 'swr';
import fetchWithBackup from '@/src/utils/fetchWithBackup';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BackButton from '../BackButton';
import LogoContainer from '../LogoContainer';
import LinkLogoImage from '../LinkLogoImage';
import LegendContentInstitutions from '../LegendContentInstitutions';
import LegendContentProjects from '../LegendContentProjects';


enum ProjectMapSteps {
  SelectingInstitution,
  SelectingProject,
  ViewingProject,
}

type ProjectMapStates =
  | { step: ProjectMapSteps.SelectingInstitution, institution: "", project: "" }
  | { step: ProjectMapSteps.SelectingProject, institution: string, project: "" }
  | { step: ProjectMapSteps.ViewingProject, institution: string, project: string }

type ProjectMapActions =
  | { type: "institution-select", institution: string }
  | { type: "institution-deselect" }
  | { type: "project-select", project: string }
  | { type: "project-deselect" }
  | { type: "load-from-search-params", institution: string, project: string }

const initialState: ProjectMapStates = {
  step: ProjectMapSteps.SelectingInstitution, 
  institution: "",
  project: ""
}

function reducer(state: ProjectMapStates, action: ProjectMapActions): ProjectMapStates {
  switch (action.type) {
    case "institution-select": {
      return { step: ProjectMapSteps.SelectingProject, institution: action.institution, project: "" };
    }
    case "institution-deselect":{
      return { step: ProjectMapSteps.SelectingInstitution, institution: "", project: "" };
    }
    case "project-select":{
      return { step: ProjectMapSteps.ViewingProject, institution: state.institution, project: action.project };
    }
    case "project-deselect":{
      return { step: ProjectMapSteps.SelectingProject, institution: state.institution, project: "" };
    }
    case "load-from-search-params": {
      return { step: ProjectMapSteps.ViewingProject, institution: action.institution, project: action.project }
    }
  }
}

export default function ViewController() {
  'use memo';

  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [chosenState, setChosenState] = useState<string>("WI")
  const [stateFilterMode, setStateFilterMode] = useState<StateFilterMode>("All");
  const [classificationFilterMode, setClassificationFilterMode] = useState<ClassificationFilterMode>("All");
  const { data: getProjectsResponse } = useSWR(
      [getProjects], 
      () => fetchWithBackup('getProjects', getProjects),
      { suspense: true }
  );

  // remove all projects that are falsy in specific fields that we need
  const validProjectsData = useMemo(() => { // breaks without this explicit memo for some reason
    return Object.fromEntries(
      Object.entries(getProjectsResponse.data ?? {}).filter(([, p]) =>
        p.projectInstitutionName &&
        p.projectName &&
        p.projectInstitutionLatitude &&
        p.projectInstitutionLongitude
      )
    ) as Record<string, ProjectData>;
  }, [getProjectsResponse.data]);

  const projectBinsByInstitution: Record<string, ProjectData[]> =
    Object.values(validProjectsData ?? {}).reduce<Record<string, ProjectData[]>>(
      (bins, project) => {
        bins[project.projectInstitutionName] ??= [];
        bins[project.projectInstitutionName].push(project as ProjectData);
        return bins;
      },
      {}
    );

  const searchedBinnedProjects: Record<string, ProjectData[]> = Object.fromEntries(
    Object.entries(projectBinsByInstitution).filter(([, projects]) => {
      const firstProject = projects[0];
      
      if (state.institution && firstProject.projectInstitutionName != state.institution) {
        return false
      }
      if (stateFilterMode === 'EPSCOR' && !firstProject.projectEpscorState) {
        return false;
      }
      if (stateFilterMode === 'Specific' && firstProject.projectInstitutionState !== chosenState) {
        return false;
      }
      if (classificationFilterMode === 'NonR1') {
        const classification = firstProject.projectInstitutionCarnegieClassification2025;
        if (!classification || classification.includes("Research 1:")) {
          return false;
        }
      }
      
      return firstProject.projectInstitutionName
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
    }).sort()
  );

  const searchedBinnedProjectsArray = Object.values(searchedBinnedProjects);

  const projectSearchParam = searchParams.get('project')
  const sidebarHiddenSearchParam = searchParams.get('sidebarHidden')

  useEffect(() => {
    if (!projectSearchParam || !validProjectsData[projectSearchParam]) return
    dispatch({ type: "load-from-search-params", institution: validProjectsData[projectSearchParam].projectInstitutionName, project: projectSearchParam })
  }, [projectSearchParam, validProjectsData])

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentProject = params.get('project');
    
    if (state.step == ProjectMapSteps.ViewingProject) {
      // Only update if the URL doesn't already have the correct project
      if (currentProject !== state.project) {
        params.set('project', state.project);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } else {
      // Only update if there's a project param to remove
      if (currentProject !== null) {
        params.delete('project');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [state.step, pathname, router, searchParams, state.project])

  const isSelectingInstitution = state.step === ProjectMapSteps.SelectingInstitution;
  const isSelectingProject = state.step === ProjectMapSteps.SelectingProject;
  const isViewingProject = state.step === ProjectMapSteps.ViewingProject;

  const handleInstitutionSelect = (institution: string) => { dispatch({ type: "institution-select", institution }); }
  
  // Gets the pins for the selected project if there is one
  const { data: projectOverviewResponse } = useSWR(
    // having null as the key makes SWR always instantly return { data: undefined, error: undefined, isLoading: false }
    state.project != "" ? [validProjectsData[state.project], getProjectOverview] : null, 
    () => fetchWithBackup('getProjectOverview', getProjectOverview, validProjectsData[state.project].projectName),
    { suspense: true }
  ) 

  console.log(projectOverviewResponse)

  function downloadCSV() {
    const headers: (keyof InstitutionData)[] =[
      "institutionName", 
      "numJobs", 
      "cpuHours", 
      "gpuHours", 
      "osdfFileTransferCount", 
      "osdfByteTransferCount"
    ];

    const rows = Object.values(projectOverviewResponse.data).map((institution) => 
      headers.map(header => {
        const value = institution[header] ?? "";
        return typeof value === 'string' ? `"${value}"` : value;
      })
    );

    const csvContent =[
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // this Uint8Array is the "UTF-8 Byte Order Mark (BOM)", it forces Excel to read the file correctly 
    // to avoid garbled text that you would otherwise get on older machines with special characters
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const url = URL.createObjectURL(new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' }));
    
    const link = document.createElement('a');
    link.href = url;
    link.download = state.project + '.csv';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {
        isViewingProject ?
          projectOverviewResponse ?
            <InstitutionPins mainPin={validProjectsData[state.project]} institutionPins={projectOverviewResponse.data} />
          :
            <LoadingScreen />
        :
          <ProjectPins
            bins={searchedBinnedProjectsArray}
            onClick={handleInstitutionSelect}
            hidden={isViewingProject}
          />
      }

      
      <Legend left={sidebarHiddenSearchParam ? 0 : 400}>
        {isViewingProject ? <LegendContentProjects />: <LegendContentInstitutions /> }
      </Legend>

      {sidebarHiddenSearchParam ? <></> :
        <Sidebar
          header={
            <>
              <BackButton
                link={isSelectingInstitution ? "../" : ""}
                onClick={() => isSelectingInstitution ? {} : dispatch({ type: isSelectingProject ? "institution-deselect" : "project-deselect" })}
              />
              
              <Box>
                {
                  isSelectingInstitution ?
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search institutions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    : isSelectingProject ?
                      <Typography variant="h5" align='center' sx={{ textWrap: 'balance' }}>{state.institution}</Typography>
                    : // isViewing Project
                      <Typography variant="h5" align='center' sx={{ textWrap: 'balance' }}>{addSpacesToUnderscores(state.project)}</Typography>
                }
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.5 }}>
                <Box>
                  {
                    isSelectingInstitution ?
                      <DropdownPopover icon={
                        <Badge variant="dot" color="primary" invisible={stateFilterMode == 'All' && classificationFilterMode == 'All'}>
                          <FilterAlt />
                        </Badge>
                      }>
                        <InstitutionFilterMenu
                          classificationFilterMode={classificationFilterMode}
                          setClassificationFilterMode={setClassificationFilterMode}
                          stateFilterMode={stateFilterMode}
                          setStateFilterMode={setStateFilterMode}
                          chosenState={chosenState}
                          setChosenState={setChosenState}
                        />
                      </DropdownPopover>
                      : isViewingProject ? 
                          <IconButton
                            size="small"
                            onClick={downloadCSV}
                          >
                            <FileDownloadIcon />
                          </IconButton>
                      : <></>
                  }
                </Box>
              </Box>
            </>
          }
          body={
            isSelectingInstitution ?
              (
                searchedBinnedProjectsArray.map((bin) =>
                  <ProjectInstitutionListCard
                    key={bin[0].projectInstitutionName}
                    onClick={() => dispatch({ type: "institution-select", institution: bin[0].projectInstitutionName })}
                    project={bin[0]}
                  />
                )
              )
            : isSelectingProject ?
              (
                [...projectBinsByInstitution[state.institution]]
                  .sort((a, b) => b.numJobs - a.numJobs)
                  .map((project: ProjectData) => (
                    <ProjectListCard
                      key={project.projectName}
                      project={project}
                      click={(p) => dispatch({ type: "project-select", project: p })}
                    />
                  ))
              )
            : // isViewingProject
              (
                < ProjectStats date={getProjectsResponse.date} stats={validProjectsData[state.project]} />
              )
          }
        />
      }
    </>
  );
}