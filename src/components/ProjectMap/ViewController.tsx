'use client'

import { Box, Button, colors, Divider, IconButton, Link, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import { ProjectData } from '@/src/utils/adstash';
import Sidebar from '../Sidebar';
import SidebarStack from '../SidebarStack';
import ProjectPins, { ProjectPinProps } from "./ProjectPins"
import InsitutionPins from "./InsitutionPins"
import ProjectStats from "./ProjectStats"
import ProjectListCard from './ProjectListCard';
import InsitutionListCard from './InstitutionListCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addSpacesToUnderscores } from '@/src/utils/formatters';

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

const initialState: MapStates = {
  step: MapSteps.SelectingInstitution, 
  institution: "",
  project: ""
}

function reducer(state: MapStates, action: MapActions): MapStates {
  console.log(state, action);
  switch (action.type) {
    case "institution-select": {
      return { ...state, step: MapSteps.SelectingProject, institution: action.institution, project: "" };
    }
    case "institution-deselect":{
      return { ...state, step: MapSteps.SelectingInstitution, institution: "", project: "" };
    }
    case "project-select":{
      return { ...state, step: MapSteps.ViewingProject, project: action.project };
    }
    case "project-deselect":{
      return { ...state, step: MapSteps.SelectingProject, project: "" };
    }
  }
}

export default function ViewController({ rawProjectsData }: {rawProjectsData: Record<string, Partial<ProjectData>>  }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTerm, setSearchTerm] = useState<string>('');


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
          <InsitutionPins mainPin={filteredProjectsData[state.project]} />
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
          {/* <Typography
            variant='subtitle2'
            align='center'
            lineHeight={isViewingProject ? undefined : 1.1}
            sx={{
              mb: 1,
              textWrap: 'pretty'
            }}
          >
            {isSelectingInstitution && "Select an institution from the list or by cliking on the map"}
            {isSelectingProject && state.institution }
            {isViewingProject && addSpacesToUnderscores(state.project) }
          </Typography> */}
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
                  < ProjectStats stats={filteredProjectsData[state.project]} />
                )
          }
        </SidebarStack>
      </Sidebar>
    </>
  );
}