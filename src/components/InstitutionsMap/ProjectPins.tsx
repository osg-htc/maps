'use client'

import { Typography } from '@mui/material'
import MapPin from '../MapPin'
import ArrowPopUp from '../ArrowPopUp'
import { InstitutionData, ProjectData } from '@/src/utils/adstash'
import MapPinContents from '../MapPinContents'
import PersonIcon from '@mui/icons-material/Person';

function ProjectPins({ mainPin, data }: { mainPin: InstitutionData, data: Record<string, Partial<ProjectData>> | undefined}) {

  console.log(data)

  const filteredProjectContributors: Record<string, ProjectData> = Object.fromEntries(
    Object.entries(data ?? []).filter(([, p]) =>
      p.projectInstitutionName &&
      p.projectInstitutionLatitude &&
      p.projectInstitutionLongitude
    )
  ) as Record<string, ProjectData>;

  console.log(filteredProjectContributors)

  const filteredProjectContributorsArray = Object.values(filteredProjectContributors)

  console.log(filteredProjectContributorsArray)

  return (
    <>
      <MapPin
        lat={mainPin.institutionLatitude}
        lon={mainPin.institutionLongitude}
        onTop
        content={<MapPinContents color='secndary.main' size={40}/>}
      />
      {
        filteredProjectContributorsArray.map((p, i) => {
          return <MapPin
            key={i}
            lat={p.projectInstitutionLatitude}
            lon={p.projectInstitutionLongitude}
            content={
              <MapPinContents
                color='primary.main'
                size={40}
              >
                <PersonIcon
                  sx={{
                    fontSize: 20,
                    color: 'white',
                  }}
                />
              </MapPinContents>
            }
            popUp={
              <ArrowPopUp>
                <Typography align="center" noWrap variant="subtitle2" lineHeight={1} color={"secondary.main"}>
                  {p.projectInstitutionName}
                </Typography>
              </ArrowPopUp>
            }
          />
        })
      }
    </>
  )
}

export default ProjectPins
