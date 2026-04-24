'use client'

import { getProjects } from '@/src/utils/adstash';
import useSWR from 'swr';
import ViewController from './ViewController';
import LoadingScreen from '../LoadingScreen';
import fetchWithBackup from '@/src/utils/fetchWithBackup';

export default function ViewControllerLoader() {
    const { data, isLoading } = useSWR(
      [getProjects], 
      () => fetchWithBackup(getProjects),
      {
        revalidateOnFocus: false, // prevents useSWR from fetching a new array when we click 
        // around the page, which we need to to because that new fetched data would have a 
        // new data which triggers unnecessary re-renders
      }
    );

  if (isLoading || !data) {
    return <LoadingScreen></LoadingScreen>   
  } else {
    return <ViewController date={ data.date } rawProjectsData={data.data}></ViewController>
  }
   
}

