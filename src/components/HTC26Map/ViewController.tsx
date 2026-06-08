'use client';

import { Circle } from '@mui/icons-material';
import MapPinContents from '../MapPinContents';
import attendees from './attendees.json';
import MapPin from '../MapPin';
import ArrowPopUp from '../ArrowPopUp';
import { Typography } from '@mui/material';
import { getPinColor } from '@/src/utils/Pincolors';
import { useSearchParams } from 'next/navigation';

type Institution = {
  "Institution ID": string;
  "International?": string;
  "Institution Name": string;
  "Institution Ror Id": string;
  "Institution Unit ID": string | number;
  "Institution Longitude": string | number;
  "Institution Latitude": string | number;
  "Institution Ipeds State": string;
  "Institution website_address": string;
  "Institution historically_black_college_or_university": string;
  "Institution tribal_college_or_university": string;
  "Institution program_length": string;
  "Institution control": string;
  "Institution state": string;
  "Institution institution_size": string;
  "Institution classification2021": string;
  "Institution classification2025": string;
};

type Attendee = Institution & {
  "Name": string;
  "Email": string;
  "Attending": string;
  "Institution": string;
  "Institution Created": string;
};

type AttendingInstitution = Institution & {
  "Attendees": number;
};

export default function ViewController() {
  const searchParams = useSearchParams();
  
  
  const attendingInstitutions = Object.values(
    attendees.reduce<Record<string, AttendingInstitution>>(
      (institutions, attendee) => {
        const {
          Name: _name,
          Email: _email,
          Attending: _attending,
          Institution: _institution,
          "Institution Created": _created,
          ...institutionData
        } = attendee as Attendee;

        const id = institutionData["Institution ID"];

        if (id === "N/A" || id === "-") return institutions;

        if (!institutions[id]) {
          institutions[id] = { ...institutionData, Attendees: 0 };
        }

        institutions[id].Attendees += 1;
        return institutions;
      },
      {}
    )
  );

  const internationalInstitutions = attendingInstitutions.filter(x => x['International?'] === "Yes")

  console.log(attendees);
  console.log(attendingInstitutions);
  console.log(internationalInstitutions);

  const colorParam = Number(searchParams.get('color'))

  return <>
  
    {internationalInstitutions.map((i, k) => {
      return <MapPin
        key={i['Institution Name']}
        lat={i['Institution Latitude'] as number}
        lon={i['Institution Longitude'] as number}
        content={
          <MapPinContents
            color={getPinColor((k+colorParam)*colorParam)}
            size={40}
          >
            {/* <Circle sx={{
              color: 'white',
              fontSize: 10,
            }} /> */}
          </MapPinContents>
        }
        popUp={
          <ArrowPopUp>
            <Typography align="center" noWrap variant="subtitle2" lineHeight={1} color={"secondary.main"}>
              {i['Institution Name']}
            </Typography>
          </ArrowPopUp>
        }
        
      />
    })}
  </>;
}