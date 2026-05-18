'use client';

import { Typography } from "@mui/material";
import Sidebar from "../Sidebar";
import useSWR from "swr";
import { getInstitutions } from "@/src/utils/adstash";
import fetchWithBackup from "@/src/utils/fetchWithBackup";

export default function ViewController() {

  const { data: getInstitutionsResponse } = useSWR(
    [getInstitutions], 
    () => fetchWithBackup("getInstitutions", getInstitutions),
    { suspense: true }
  );

  console.log(getInstitutionsResponse)

  return (
    <Sidebar body={
      <Typography>Hello, World!</Typography>
    } />
  )
}
