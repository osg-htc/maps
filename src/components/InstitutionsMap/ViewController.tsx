'use client';

import { Badge, TextField, Typography } from "@mui/material";
import Sidebar from "../Sidebar";
import useSWR from "swr";
import { getInstitutions, getInstitutionOverview, InstitutionData } from "@/src/utils/adstash";
import fetchWithBackup from "@/src/utils/fetchWithBackup";
import { useEffect, useMemo, useReducer, useState } from "react";
import InstitutionPins from "./InstitutionPins";
import InstitutionListCard from "./InstitutionListCard";
import Legend from "../Legend";
import LegendContentInstitutions from "../LegendContentInstitutions";
import BackButton from "../BackButton";
import DropdownPopover from "../DropdownPopover";
import { FilterAlt } from "@mui/icons-material";
import InstitutionFilterMenu, { ClassificationFilterMode, StateFilterMode } from '../InstitutionFilterMenu';
import InstitutionStats from "./InstitutionStats";
import ProjectPins from "./ProjectPins";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LegendContentContributions from "../LegendContentContributions";

enum InstitutionMapSteps {
  SelectingInstitution,
  ViewingInstitution,
}

type InstitutionMapStates =
  | { step: InstitutionMapSteps.SelectingInstitution, institution: "" }
  | { step: InstitutionMapSteps.ViewingInstitution, institution: string }

type InstitutionMapActions =
  | { type: "institution-select", institution: string }
  | { type: "institution-deselect" }
  | { type: "load-from-search-params", institution: string,}

const initialState: InstitutionMapStates = {
  step: InstitutionMapSteps.SelectingInstitution, 
  institution: ""
}

function reducer(state: InstitutionMapStates, action: InstitutionMapActions): InstitutionMapStates {
  switch (action.type) {
    case "institution-select": {
      return { step: InstitutionMapSteps.ViewingInstitution, institution: action.institution};
    }
    case "institution-deselect":{
      return { step: InstitutionMapSteps.SelectingInstitution, institution: ""};
    }
    case "load-from-search-params": {
      return { step: InstitutionMapSteps.ViewingInstitution, institution: action.institution}
    }
  }
}

export default function ViewController() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [chosenState, setChosenState] = useState<string>("WI")
  const [stateFilterMode, setStateFilterMode] = useState<StateFilterMode>("All");
  const [classificationFilterMode, setClassificationFilterMode] = useState<ClassificationFilterMode>("All");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data: getInstitutionsResponse } = useSWR(
    [getInstitutions], 
    () => fetchWithBackup("getInstitutions", getInstitutions),
    { suspense: true }
  );

  const validInstitutions: Record<string, InstitutionData> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(getInstitutionsResponse.data ?? {}).filter(([, i]) =>
        i.institutionName &&
        i.institutionName &&
        i.institutionLatitude &&
        i.institutionLongitude
      )
    ) as Record<string, InstitutionData>;
  }, [getInstitutionsResponse.data]);

  const filteredInstitutions: Record<string, InstitutionData> = Object.fromEntries(
      Object.entries(validInstitutions).filter(([, institution]) => {
        if (state.institution && institution.institutionName != state.institution) {
          return false
        }
        if (stateFilterMode === 'EPSCOR' && !institution.institutionEpscorState) {
          return false;
        }
        if (stateFilterMode === 'Specific' && institution.institutionState !== chosenState) {
          return false;
        }
        if (classificationFilterMode === 'NonR1') {
          const classification = institution.institutionCarnegieClassification2025;
          if (!classification || classification.includes("Research 1:")) {
            return false;
          }
        }
        
        return institution.institutionName
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim());
      }).sort()
  );

  const filteredInstitutionsArray: InstitutionData[] = Object.values(filteredInstitutions)

  
  const institutionSearchParam = searchParams.get('institution')
  const sidebarHiddenSearchParam = searchParams.get('sidebarHidden')
  
  useEffect(() => {
    if (!institutionSearchParam || !validInstitutions[institutionSearchParam]) return
    dispatch({ type: "load-from-search-params", institution: validInstitutions[institutionSearchParam].institutionName })
  }, [institutionSearchParam, validInstitutions])

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentProject = params.get('institution');
    
    if (state.step == InstitutionMapSteps.ViewingInstitution) {
      // Only update if the URL doesn't already have the correct project
      if (currentProject !== state.institution) {
        params.set('institution', state.institution);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } else {
      // Only update if there's a project param to remove
      if (currentProject !== null) {
        params.delete('institution');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [state.step, pathname, router, searchParams, state.institution])
  
  // Gets the projects contributed to for the selected institution if there is one
  const { data: institutionOverviewResponse } = useSWR(
    // having null as the key makes SWR always instantly return { data: undefined, error: undefined, isLoading: false }
    state.institution != "" ? [validInstitutions[state.institution], getInstitutionOverview] : null, 
    () => fetchWithBackup('getInstitutionOverview', getInstitutionOverview, validInstitutions[state.institution].institutionName),
    { suspense: true }
  ) 

  const isSelectingInstitution = state.step === InstitutionMapSteps.SelectingInstitution;

  return (
    <>
      <InstitutionPins institutions={filteredInstitutionsArray} hidden={!isSelectingInstitution} onClick={(e) => { dispatch({ type: "institution-select", institution: e }) }} />
      
      {isSelectingInstitution ? <></> : <ProjectPins mainPin={validInstitutions[state.institution]} data={institutionOverviewResponse.data} /> }

      <Legend left={sidebarHiddenSearchParam ? 0 : 400}>
        {isSelectingInstitution ? <LegendContentInstitutions /> : <LegendContentContributions /> }
      </Legend>

      {sidebarHiddenSearchParam ? <></> :
        <Sidebar
          leftButton={
            isSelectingInstitution ? <BackButton link={"../"} /> : <BackButton onClick={() => { dispatch({ type: "institution-deselect" }) }} />
          }
          header={
            isSelectingInstitution ?
              <TextField
                fullWidth
                size="small"
                placeholder="Search institutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              :
              <Typography variant="h5" align='center' sx={{ textWrap: 'balance' }}>{state.institution}</Typography>
          }
          rightButton={
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
          }
          body={
            isSelectingInstitution ?
              filteredInstitutionsArray.map((institution) =>
                <InstitutionListCard
                  key={institution.institutionName}
                  onClick={() => { dispatch({ type: "institution-select", institution: institution.institutionName }) }}
                  institution={institution}
                />
              )
              :
              <InstitutionStats stats={validInstitutions[state.institution]} date={getInstitutionsResponse.date} />
          }
        />
      }
    </>
  )
}
