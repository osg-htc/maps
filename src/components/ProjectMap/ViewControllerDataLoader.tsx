'use client'

import { getProjects } from '@/src/utils/adstash';
import useSWR from 'swr';
import ViewController from './ViewController';
import LoadingScreen from '../LoadingScreen';
import fetchWithBackup from '@/src/utils/fetchWithBackup';

export default function ProjectDataLoader() {
  const { data, isLoading} = useSWR([getProjects], () => fetchWithBackup(getProjects));

  if (isLoading || !data) {
    return <LoadingScreen></LoadingScreen>   
  } else {
    return <ViewController date={ data.date } rawProjectsData={data.data}></ViewController>
  }
   
}

