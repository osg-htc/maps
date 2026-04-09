'use client'

import { getProjects } from '@/src/utils/adstash';
import useSWR from 'swr';
import ViewController from './ViewController';
import LoadingScreen from '../LoadingScreen';

export default function ProjectDataLoader() {
  const { data, isLoading} = useSWR([getProjects], () => getProjects());

  if (isLoading || !data) {
    return <LoadingScreen></LoadingScreen>   
  } else {
    return <ViewController rawProjectsData={data}></ViewController>
  }
   
}

