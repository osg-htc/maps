'use client';

import { Typography } from "@mui/material";
import Sidebar from "../Sidebar";
import useSWR from "swr";
import { getInstitutions, InstitutionData } from "@/src/utils/adstash";
import fetchWithBackup from "@/src/utils/fetchWithBackup";
import { useMemo } from "react";
import InstitutionPins from "./InstitutionPins";
import InstitutionListCard from "./InstitutionListCard";
import Legend from "../Legend";
import LegendContentInstitutions from "../LegendContentInstitutions";

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

      <Sidebar body={
        validInstitutionsArray.map((institution) =>
          <InstitutionListCard
            key={institution.institutionName}
            onClick={() => { }}
            institution={institution}
          />
        )
      } />
    </>
  )
}
