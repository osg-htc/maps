'use client'

import { Typography } from '@mui/material'
import MapPin from '../MapPin'
import ArrowPopUp from '../ArrowPopUp'
import { ProjectData } from '@/src/utils/adstash'
import MapPinContents from '../MapPinContents'
import { getPinColor } from '@/src/utils/helpers'

function ProjectPins({ bins, onClick, hidden} : { bins: ProjectData[][], onClick: (arg0: string) => void, hidden?: boolean }) {
  return (
    <>
      {
        bins.map((bin) => {
          const p = bin[0] // first project > reprasentative of the institution itself

          return <MapPin
            key={p.projectInstitutionName}
            lat={p.projectInstitutionLatitude}
            lon={p.projectInstitutionLongitude}
            hidden={hidden}
            extraZ={bin.length}
            onClick={() => onClick(p.projectInstitutionName)}
            content={
              <MapPinContents
                color={getPinColor(p.projectInstitutionCarnegieClassification2025, p.projectEpscorState)}
                size={40}
              >
                <Typography sx={{
                  color: "white", 
                  fontSize: 20, 
                }}>
                  {bin.length}
                </Typography>
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
