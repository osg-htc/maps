import { Typography } from '@mui/material'
import MapPin from '../MapPin'
import ArrowPopUp from '../ArrowPopUp'
import React from 'react'
import { ProjectData } from '@/src/utils/adstash'

function ProjectsPin({ projects, onClick, hidden = false }: { projects: ProjectData[], onClick: () => void, hidden?: boolean }) {
  const p = projects[0]

  return (
    <MapPin
      key={p.projectInstitutionName}
      name={p.projectInstitutionName}
      text={projects.length}
      color={'primary.main'}
      size={40}
      lat={p.projectInstitutionLatitude}
      lon={p.projectInstitutionLongitude}
      hidden={hidden}
      onClick={onClick}
    >
      <ArrowPopUp>
        <Typography align="center" noWrap variant="subtitle2" lineHeight={ 1 } color={"secondary.main"}>
          {p.projectInstitutionName}
        </Typography>
      </ArrowPopUp>
    </MapPin>
  )
}

export default React.memo(ProjectsPin)