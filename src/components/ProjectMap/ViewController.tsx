'use client'

import { Badge, Box, IconButton, Link, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { ProjectData } from '@/src/utils/adstash';
import Sidebar from '../Sidebar';
import SidebarStack from '../SidebarStack';
import ProjectsPin from "./ProjectsPin"
import InstitutionPinsDataLoader from "./InstitutionPinsDataLoader"
import ProjectStats from "./ProjectStats"
import ProjectListCard from './ProjectListCard';
import ProjectInsitutionListCard from './ProjectInsitutionListCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addSpacesToUnderscores } from '@/src/utils/helpers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Legend from '../Legend';
import { FilterAlt } from '@mui/icons-material';
import MapPinContents from '../MapPinContents';
import DropdownPopover from '../DropdownPopover';
import InstitutionFilterMenu, { ClassificationFilterMode, StateFilterMode } from './InstitutionFilterMenu';

enum MapSteps {
  SelectingInstitution,
  SelectingProject,
  ViewingProject,
}

type MapStates =
  | { step: MapSteps.SelectingInstitution, institution: "", project: "" }
  | { step: MapSteps.SelectingProject, institution: string, project: "" }
  | { step: MapSteps.ViewingProject, institution: string, project: string }

type MapActions =
  | { type: "institution-select", institution: string }
  | { type: "institution-deselect" }
  | { type: "project-select", project: string }
  | { type: "project-deselect" }
  | { type: "load-from-search-params", institution: string, project: string }

const initialState: MapStates = {
  step: MapSteps.SelectingInstitution, 
  institution: "",
  project: ""
}

function reducer(state: MapStates, action: MapActions): MapStates {
  switch (action.type) {
    case "institution-select": {
      return { step: MapSteps.SelectingProject, institution: action.institution, project: "" };
    }
    case "institution-deselect":{
      return { step: MapSteps.SelectingInstitution, institution: "", project: "" };
    }
    case "project-select":{
      return { step: MapSteps.ViewingProject, institution: state.institution, project: action.project };
    }
    case "project-deselect":{
      return { step: MapSteps.SelectingProject, institution: state.institution, project: "" };
    }
    case "load-from-search-params": {
      return { step: MapSteps.ViewingProject, institution: action.institution, project: action.project }
    }
  }
}

export default function ViewController({ date, rawProjectsData }: { date: Date, rawProjectsData: Record<string, Partial<ProjectData>>  }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [chosenState, setChosenState] = useState<string>("WI")
  const [stateFilterMode, setStateFilterMode] = useState<StateFilterMode>("All");
  const [classificationFilterMode, setClassificationFilterMode] = useState<ClassificationFilterMode>("All");

  // remove all projects that are falsy in specific fields that we need
  const validProjectsData: Record<string, ProjectData> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(rawProjectsData ?? {}).filter(([_, p]) =>
        p.projectInstitutionName &&
        p.projectName &&
        p.projectInstitutionLatitude &&
        p.projectInstitutionLongitude
      )
    ) as Record<string, ProjectData>;
  }, [rawProjectsData])
  
  const projectBinsByInstitution: Record<string, ProjectData[]> = useMemo(() => {
    return Object.values(validProjectsData ?? {}).reduce<Record<string, ProjectData[]>>(
      (bins, project) => {
        bins[project.projectInstitutionName] ??= [];
        bins[project.projectInstitutionName].push(project as ProjectData);
        return bins;
      },
      {}
    );
  }, [validProjectsData]);

  const searchedBinnedProjects: Record<string, ProjectData[]> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(projectBinsByInstitution).filter(([_, projects]) => {
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
      })
    );
  }, [projectBinsByInstitution, searchTerm, stateFilterMode, chosenState, classificationFilterMode, state.institution]);

  const searchedBinnedProjectsArray = useMemo(() => {
    return Object.values(searchedBinnedProjects);
  }, [searchedBinnedProjects]);

  const projectSearchParam = searchParams.get('project')

  useEffect(() => {
    if (!projectSearchParam || !validProjectsData[projectSearchParam]) return
    dispatch({ type: "load-from-search-params", institution: validProjectsData[projectSearchParam].projectInstitutionName, project: projectSearchParam })
  }, [projectSearchParam, validProjectsData])

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentProject = params.get('project');
    
    if (state.step == MapSteps.ViewingProject) {
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

  const isSelectingInstitution = state.step === MapSteps.SelectingInstitution;
  const isSelectingProject = state.step === MapSteps.SelectingProject;
  const isViewingProject = state.step === MapSteps.ViewingProject;

  const handleInstitutionSelect = useCallback((institution: string) => {
    dispatch({ type: "institution-select", institution });
  }, []);

  return (
    <>
      {
        isViewingProject ?
          <InstitutionPinsDataLoader mainPin={validProjectsData[state.project]} />
        :
          searchedBinnedProjectsArray.map((bin) => {
            return <ProjectsPin
              key={ bin[0].projectInstitutionName }
              projects={bin}
              onClick={handleInstitutionSelect}
              hidden={isViewingProject}
            />
          })
      }

      {isViewingProject ?
        <Legend>
          <Stack direction="row" alignItems="center" spacing={0}>
            <MapPinContents color='primary.main' size={30} />
            <Typography variant="subtitle1">Selected institution</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0}>
            <MapPinContents color='secondary.main' size={30} />
            <Typography variant="subtitle1">Contributing institution</Typography>
          </Stack>
        </Legend>
        : <></>
      }

      <Sidebar>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: '40px auto 40px',
            alignItems: 'center',
            mb: 1
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Link href={isSelectingInstitution ? "../" : ""}>
              <IconButton disableRipple
                size="small"
                onClick={() => isSelectingInstitution ? {} :dispatch({ type: isSelectingProject ? "institution-deselect" : "project-deselect" })}
              >
                <ArrowBackIcon />
              </IconButton> 
            </Link>
          </Box>
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
                <Typography variant="h5" align='center' sx={{textWrap: 'balance'}}>{ state.institution }</Typography>
              : // isViewing Project
                <Typography variant="h5" align='center' sx={{textWrap: 'balance'}}>{ addSpacesToUnderscores(state.project) }</Typography>    
            }
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}> 
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
              : <></>  
            }
          </Box>
        </Box>

        <SidebarStack>
          {
            isSelectingInstitution ?
              (
                searchedBinnedProjectsArray.map((bin) =>
                  <ProjectInsitutionListCard
                    key={bin[0].projectInstitutionName}
                    onClick={() => dispatch({ type: "institution-select", institution: bin[0].projectInstitutionName })}
                    project={bin[0]}
                  />
                )
              )
            : isSelectingProject ?
              (
                projectBinsByInstitution[state.institution]
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
                  < ProjectStats date={ date } stats={validProjectsData[state.project]} />
                )
          }
        </SidebarStack>
      </Sidebar>
    </>
  );
}