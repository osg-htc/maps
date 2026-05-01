'use client'

import { Typography } from '@mui/material'
import MapPin from '../MapPin'
import ArrowPopUp from '../ArrowPopUp'
import React from 'react'
import { ProjectData } from '@/src/utils/adstash'
import MapPinContents from '../MapPinContents'

export const epscorColor = '#B61F24' // PATh red
export const nonR1Color = '#0885ff' // Pelican blue
export const epscorNonR1Color = '#8a84d6' // iris purple 

function ProjectPins({ bins, onClick, hidden} : { bins: ProjectData[][], onClick: (arg0: string) => void, hidden?: boolean }) {
  return (
    <>
      {
        bins.map((bin) => {
          let p = bin[0] // first project > reprasentative of the institution itself

          const classification = p.projectInstitutionCarnegieClassification2025;
          const nonR1 = (classification && !classification.includes("Research 1:")) 
          let color = 'primary.main'

          if (p.projectEpscorState && nonR1) { 
            color = epscorColor 
          } else if (p.projectEpscorState) {
            color = epscorColor 
          } else if (nonR1) {
            color = nonR1Color 
          }

          return <MapPin
            key={p.projectInstitutionName}
            lat={p.projectInstitutionLatitude}
            lon={p.projectInstitutionLongitude}
            hidden={hidden}
            extraZ={bin.length}
            onClick={() => onClick(p.projectInstitutionName)}
            content={
              <MapPinContents color={color} size={40} text={`${bin.length}`} />
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
