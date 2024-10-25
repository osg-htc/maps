import React, { useState, useEffect, useMemo } from 'react';
import { Marker } from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from '@mui/material';
import { getFacilityEsData } from '@/data/eqInstitutions';
import Sidebar from './Sidebar';
import { useRouter, useSearchParams } from 'next/navigation'

type MarkersProps = {
  mapRef: React.RefObject<any>;
  zoom: number;
};

const MarkersComponent: React.FC<MarkersProps> = ({ mapRef, zoom }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const faculty = searchParams.get('faculty')
  const [esData, setEsData] = useState<any>({});
  const [markerSize, setMarkerSize] = useState<any>('small');
  const [selectedMarker, setSelectedMarker] = useState<any | null>(
      null
  );
  const [facultyName, setFacultyName] = useState<string>('');
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [idToName, setIdToName] = useState<any>({});

  useEffect(() => {
    // Fetch the ElasticSearch data when the component mounts
    const fetchData = async () => {
      const data = await getFacilityEsData();
      setEsData(data);
      console.log("Facility data is fetched")
    };

    const fetchInstitutions = async () => {
      try{
        const response = await fetch('https://topology-institutions.osg-htc.org/api/institution_ids')
        const data = await response.json()
        setInstitutions(data)
        //console.log("data:", data)
        console.log("Institution data is fetched")
      } catch(error) {
        console.error(error)
      }
    }

    const fetchMappingEndpoint = async () => {
      try{
        const response = await fetch('https://topology.opensciencegrid.org/miscfacility/json')
        const data = await response.json()

        const mapping: Record<string, string> = {};
        for (const [name, value] of Object.entries(data)) {
          const institutionId = value.InstitutionID;
          mapping[institutionId] = name;
        }

        setIdToName(mapping) // create a map from id to name for easy lookup
        console.log("data:", mapping)
      } catch(error) {
        console.error(error)
      }
    }

    fetchData();
    fetchInstitutions()
    fetchMappingEndpoint()
  }, []);

  useEffect(() => {
    const zoomRate = (zoom: number) => {
      if (zoom < 3) {
        setMarkerSize('small');
      } else {
        setMarkerSize('large');
      }
    }
  }, [zoom])

  // Set selected marker based on the faculty query parameter on mount
  useEffect(() => {
    if (faculty) {
      const decodedFaculty = decodeURIComponent(faculty) // deocde the faculty name
      const institution = institutions.find((institution) => institution.name === decodedFaculty) // find the institution based on the faculty name
      if (institution) {
        setSelectedMarker(institution)
        setFacultyName(decodedFaculty)
        centerToMarker(institution)
        }
    }
  }, [faculty, institutions]); // re-render when the faculty changes

  const handleResetNorth = () => {
    const map = mapRef.current.getMap();
    map.flyTo({
      zoom: 4.5,
      duration: 2000,
    });
  };

  const convertName = (institution: any) => {
    const originalName = institution.name;
    const convertedName = encodeURIComponent(originalName);
    setFacultyName(convertedName);
    return convertedName;
  };

  const closeSidebar = () => {
    router.push(`/institutions`);
    setSelectedMarker(null);
    handleResetNorth();
  };

  const centerToMarker = (institution: any) => {
    const map = mapRef.current.getMap();
    map.flyTo({
      center: [institution.longitude, institution.latitude],
      zoom: 8,
      duration: 2000,
    });
  };

  const markers = useMemo(() => {
    const handleMarkerClick = (institution: any) => {
      setSelectedMarker(institution);
      const convertedName = convertName(institution);
      centerToMarker(institution);
      router.push(`/institutions?faculty=${convertedName}`);
    };

    return institutions.map((institution) => {
      const institutionId = institution.id;
      const institutionName = idToName[institutionId];
      const esInfo = esData[institutionName];

      // Handle cases where there's no matching institution in the ElasticSearch data.
      if (!esInfo) {
        return null;
      }

      return (
          <Marker
              key={institution.id}
              longitude={institution.longitude}
              latitude={institution.latitude}
          >
            <Tooltip
                title={institution.name}
                placement='top'
            >
              <LocationOnIcon
                  color='primary'
                  className='hover:scale-150 transition duration-300 ease-in-out cursor-pointer'
                  fontSize={markerSize}
                  onClick={() => handleMarkerClick(institution)}
              />
            </Tooltip>
          </Marker>
      );
    });
  }, [esData, markerSize, institutions, mapRef, idToName]);

  return (
      <>
        {markers}
        {selectedMarker && (
            <Sidebar
                facultyName={facultyName}
                onClose={closeSidebar}
                header={selectedMarker.name}
                dataState={selectedMarker.dataState}
            />
        )}
      </>
  );
};

export default MarkersComponent;
