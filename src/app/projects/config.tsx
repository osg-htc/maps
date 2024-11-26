'use client'

import React, { useMemo } from 'react';
import useSWR from 'swr';
import MapComponent from '@/app/projects/MapComponent';
import {InstitutionWithProjects} from '@/app/types/mapTypes';
import {getInstitutionsWithProjects} from "@/app/projects/util";

const Config: React.FC<{
  initialInstitutionsWithProjects: InstitutionWithProjects[];
}> = ({ initialInstitutionsWithProjects}) => {

  const { data: institutionsWithProjects } = useSWR('institutionsWithProjects', getInstitutionsWithProjects, {
    fallbackData: initialInstitutionsWithProjects,
  });

  return (
    <MapComponent
      institutionsWithProjects={institutionsWithProjects}
    />
  );
}

export default Config;