'use client'

import { Box, Card, IconButton, Link, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { ProjectData } from '@/src/utils/adstash';
import Sidebar from '../Sidebar';
import SidebarStack from '../SidebarStack';
import ProjectPins, { ProjectPinProps } from "./ProjectPins"
import InstitutionPinsDataLoader from "./InstitutionPinsDataLoader"
import ProjectStats from "./ProjectStats"
import ProjectListCard from './ProjectListCard';
import InsitutionListCard from './InstitutionListCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addSpacesToUnderscores } from '@/src/utils/helpers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Legend from '../Legend';
import { Circle, LocationPin } from '@mui/icons-material';
import MapPin from '../MapPin';
import MapPinContents from '../MapPinContents';


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

  // remove all projects that are falsy in specific fields that we need
  const filteredProjectsData: Record<string, ProjectData> = useMemo(() => {
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
    return Object.values(filteredProjectsData ?? {}).reduce<Record<string, ProjectData[]>>(
      (bins, project) => {
        bins[project.projectInstitutionName] ??= [];
        bins[project.projectInstitutionName].push(project as ProjectData);
        return bins;
      },
      {}
    );
  }, [filteredProjectsData]);


  const mapPinData: ProjectPinProps[] = useMemo(() => {
    return Object.values(projectBinsByInstitution).map((bin) => ({
      name: bin[0].projectInstitutionName,
      num: bin.length,
      lat: bin[0].projectInstitutionLatitude,
      lon: bin[0].projectInstitutionLongitude,
      onClick: () => { dispatch({ type: "institution-select", institution: bin[0].projectInstitutionName }) },
    }));
  }, [projectBinsByInstitution]);


  const projectSearchParam = searchParams.get('project')

  useEffect(() => {
    if (!projectSearchParam || !filteredProjectsData[projectSearchParam]) return
    dispatch({ type: "load-from-search-params", institution: filteredProjectsData[projectSearchParam].projectInstitutionName, project: projectSearchParam })
  }, [projectSearchParam, filteredProjectsData])

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (state.step == MapSteps.ViewingProject) {
      params.set('project', state.project)
    } else {
      params.delete('project')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [state.step, projectSearchParam])

  const isSelectingInstitution = state.step === MapSteps.SelectingInstitution;
  const isSelectingProject = state.step === MapSteps.SelectingProject;
  const isViewingProject = state.step === MapSteps.ViewingProject;

  return (
    <>
      {
        isSelectingInstitution ?
          <ProjectPins pins={mapPinData.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()))} hidden={isViewingProject} />
        : isSelectingProject ?
          <ProjectPins pins={mapPinData.filter(p => p.name == state.institution)} hidden={isViewingProject} />
        : // isViewingProject
          <InstitutionPinsDataLoader mainPin={filteredProjectsData[state.project]} />
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
            gridTemplateColumns: isSelectingInstitution ? '40px auto 0px' : '40px auto 40px',
            alignItems: 'center',
            mb: 1
          }}
        >
          <Box>
            <Link href={isSelectingInstitution ? "../" : ""}>
              <IconButton
                size="small"
                onClick={() => isSelectingInstitution ? {} :dispatch({ type: isSelectingProject ? "institution-deselect" : "project-deselect" })}
                sx={{ alignSelf: 'flex-start' }}
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

          <Box />
        </Box>

        <SidebarStack>
          {
            isSelectingInstitution ?
              (
                mapPinData
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()))
                  .map((pin) => <InsitutionListCard key={pin.name} institution={pin} />)
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
                  < ProjectStats date={ date } stats={filteredProjectsData[state.project]} />
                )
          }
        </SidebarStack>
      </Sidebar>
    </>
  );
}