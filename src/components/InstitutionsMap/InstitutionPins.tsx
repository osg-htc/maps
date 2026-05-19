'use client'

import { Typography } from '@mui/material'
import MapPin from '../MapPin'
import ArrowPopUp from '../ArrowPopUp'
import { InstitutionData, ProjectData } from '@/src/utils/adstash'
import MapPinContents from '../MapPinContents'
import { getPinColor } from '@/src/utils/helpers'

export default function InstitutionPins({ institutions, onClick, hidden} : { institutions: InstitutionData[], onClick: (arg0: string) => void, hidden?: boolean }) {
  return (
    <>
      {
        institutions.map((i) => {
          return <MapPin
            key={i.institutionName}
            lat={i.institutionLatitude}
            lon={i.institutionLongitude}
            hidden={hidden}
            onClick={() => { onClick(i.institutionName) }}
            content={
              <MapPinContents
                color={getPinColor(i.institutionCarnegieClassification2025, i.institutionEpscorState)}
                size={40}
                showPinhole
              />
            }
            popUp={
              <ArrowPopUp>
                <Typography align="center" noWrap variant="subtitle2" lineHeight={1} color={"secondary.main"}>
                  {i.institutionName}
                </Typography>
              </ArrowPopUp>
            }
          />
        })
      }
    </>
  )
}
