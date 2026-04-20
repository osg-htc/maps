'use client'

import { getProjectOverview, ProjectData } from '@/src/utils/adstash';
import useSWR from 'swr';
import LoadingScreen from '../LoadingScreen';
import fetchWithBackup from '@/src/utils/fetchWithBackup';
import InstitutionPins from './InstitutionPins';

export default function ProjectDataLoader({ mainPin }: { mainPin: ProjectData }) {
  const { data, isLoading } = useSWR([mainPin, getProjectOverview], () => fetchWithBackup(getProjectOverview, mainPin.projectName));

  if (isLoading || !data) {
    return <LoadingScreen></LoadingScreen>   
  } else {
    return <InstitutionPins mainPin={ mainPin } rawProjectOverviewData={data.data} />
  }
}

