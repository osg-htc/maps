'use client';

import { Badge, Box, TextField, Typography } from "@mui/material";
import Sidebar from "../Sidebar";
import useSWR from "swr";
import { getInstitutions, InstitutionData } from "@/src/utils/adstash";
import fetchWithBackup from "@/src/utils/fetchWithBackup";
import { useMemo, useReducer, useState } from "react";
import InstitutionPins from "./InstitutionPins";
import InstitutionListCard from "./InstitutionListCard";
import Legend from "../Legend";
import LegendContentInstitutions from "../LegendContentInstitutions";
import BackButton from "../BackButton";
import DropdownPopover from "../DropdownPopover";
import { FilterAlt } from "@mui/icons-material";
import InstitutionFilterMenu, { ClassificationFilterMode, StateFilterMode } from '../InstitutionFilterMenu';

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
  const { data: getInstitutionsResponse } = useSWR(
    [getInstitutions], 
    () => fetchWithBackup("getInstitutions", getInstitutions),
    { suspense: true }
  );

  const validInstitutions = useMemo(() => {
    return Object.fromEntries(
      Object.entries(getInstitutionsResponse.data ?? {}).filter(([, i]) =>
        i.institutionName &&
        i.institutionName &&
        i.institutionLatitude &&
        i.institutionLongitude
      )
    ) as Record<string, InstitutionData>;
  }, [getInstitutionsResponse.data]);

  const validInstitutionsArray = Object.values(validInstitutions)

  console.log(validInstitutionsArray)

  return (
    <>
      <InstitutionPins institutions={validInstitutionsArray} />

      <Legend left={400}>
        <LegendContentInstitutions />
      </Legend>

      <Sidebar
        header={
          <>
              <BackButton link={"../"}/>
              
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search institutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.5 }}>
                <Box>
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
                </Box>
              </Box>
            </>
        }
        body={
          validInstitutionsArray.map((institution) =>
            <InstitutionListCard
              key={institution.institutionName}
              onClick={() => { }}
              institution={institution}
            />
          )
        }
      />
    </>
  )
}
