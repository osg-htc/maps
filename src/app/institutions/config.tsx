'use client'

import React, { useMemo } from 'react';
import useSWR from 'swr';
import MapComponent from '@/app/institutions/MapComponent';
// @ts-ignore
import { Institution, Project, ProjectWithESData, InstitutionWithProjects } from '@/types/mapTypes';
import { getFacilityEsData } from '@/data/eqInstitutions';
import { Facility, FacilityInfo, FetcherKey, EsDataType } from '@/app/types/mapTypes';

const fetcher = <T,>(key: FetcherKey): Promise<T> => {
  if (key === 'facilities') {
    return fetch('https://topology.opensciencegrid.org/miscfacility/json').then((res) => res.json());
  } else if (key === 'institutions') {
    return fetch('https://topology-institutions.osg-htc.org/api/institution_ids').then((res) => res.json());
  } else if (key === 'esData') {
    return getFacilityEsData() as Promise<T>;
  }
  throw new Error('Invalid fetch key');
};


const Config: React.FC<{
  initialInstitutions: Institution[];
  initialFacilities: Record<string, FacilityInfo>;
  initialEsData: EsDataType;
}> = ({ initialInstitutions, initialFacilities, initialEsData }) => {

  // console.log('initialInstitutions', initialInstitutions);
  // console.log('initialEsProjects', initialEsProjects);
  const { data: institutions = initialInstitutions} = useSWR<Institution[]>('institutions', fetcher, {
    fallbackData: initialInstitutions,
  });

  const { data: facilities = initialFacilities} = useSWR<Record<string, FacilityInfo>>('facilities', fetcher, {
    fallbackData: initialFacilities,
  });

  const { data: esData = initialEsData} = useSWR<EsDataType>('esData', fetcher, {
    fallbackData: initialEsData,
  });

// Create a mapping of institution data by institutionId
  const institutionMap: Record<string, Institution> = institutions.reduce((acc: Record<string, Institution>, institution: Institution) => {
    const id = institution.id.toString(); // Ensure ID is a string if necessary
    acc[id] = { ...institution, facilities: [] }; // Initialize each institution with an empty facilities array
    return acc;
  }, {});

// Combine facility data under corresponding institutions
  Object.entries(facilities).forEach(([facilityName, facilityInfo]) => {
    const institutionId = facilityInfo.InstitutionID;
    if (institutionMap[institutionId]) {
      // Push facility data into the corresponding institution's facilities array
      institutionMap[institutionId].facilities.push({
        name: facilityName,
        ID: facilityInfo.ID,
        isCCStar: facilityInfo.IsCCStar,
        esData: esData[facilityName] || null // Attach esData if available
      });
    }
  });


  // convert to an array
  const facilityInstitutionData = Object.values(institutionMap);
  // console.log(combinedData);

  // console.log('institutionsWithProjects', institutionsWithProjects);

  return (
    <MapComponent
      esData={esData}
      facilityInstitutionData={facilityInstitutionData}
    />
  );
}

export default Config;