'use client';

import { Badge, Box, TextField, Typography } from "@mui/material";
import Sidebar from "../Sidebar";
import useSWR from "swr";
import { getInstitutions, InstitutionData } from "@/src/utils/adstash";
import fetchWithBackup from "@/src/utils/fetchWithBackup";
import { useMemo } from "react";
import InstitutionPins from "./InstitutionPins";
import InstitutionListCard from "./InstitutionListCard";
import Legend from "../Legend";
import LegendContentInstitutions from "../LegendContentInstitutions";
import BackButton from "../BackButton";
import DropdownPopover from "../DropdownPopover";
import { FilterAlt } from "@mui/icons-material";
import InstitutionFilterMenu from "../ProjectMap/InstitutionFilterMenu";

export default function ViewController() {
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
                  value={""}
                  onChange={() => {}}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.5 }}>
                <Box>
                  <DropdownPopover icon={
                    <Badge variant="dot" color="primary" invisible={true}>
                      <FilterAlt />
                    </Badge>
                  }>
                    <></>
                    {/* <InstitutionFilterMenu
                      classificationFilterMode={classificationFilterMode}
                      setClassificationFilterMode={setClassificationFilterMode}
                      stateFilterMode={stateFilterMode}
                      setStateFilterMode={setStateFilterMode}
                      chosenState={chosenState}
                      setChosenState={setChosenState}
                    /> */}
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
