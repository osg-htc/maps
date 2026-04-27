'use client'

import { Typography } from '@mui/material'
import MapPin from '../MapPin'
import ArrowPopUp from '../ArrowPopUp'
import React from 'react'
import { ProjectData } from '@/src/utils/adstash'
import MapPinContents from '../MapPinContents'

function ProjectsPin(props: { projects: ProjectData[], onClick: (arg0: string) => void, hidden?: boolean }) {
  const { projects, onClick, hidden = false } = props;
  const p = projects[0]
  return (
    <MapPin
      lat={p.projectInstitutionLatitude}
      lon={p.projectInstitutionLongitude}
      hidden={hidden}
      extraZ={projects.length}
      onClick={() => onClick(p.projectInstitutionName)}
      content={<MapPinContents color='primary.main' size={40} text={`${projects.length}`} />}
      popUp={
        <ArrowPopUp>
          <Typography align="center" noWrap variant="subtitle2" lineHeight={ 1 } color={"secondary.main"}>
            {p.projectInstitutionName}
          </Typography>
        </ArrowPopUp>
      }
    />
  )
}

export default React.memo(ProjectsPin)
