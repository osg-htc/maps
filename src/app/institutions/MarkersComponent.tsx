import React, { useState, useEffect, useMemo } from 'react';
import { Marker } from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from '@mui/material';
import { getFacilityEsData } from '@/data/eqInstitutions';
import Sidebar from './Sidebar';
import { useRouter, useSearchParams } from 'next/navigation';

type MarkersProps = {
  mapRef: React.RefObject<any>;
};

const MarkersComponent: React.FC<MarkersProps> = ({ mapRef }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const faculty = searchParams.get('faculty');
  const [esData, setEsData] = useState<any>({});
  const [markerSize, setMarkerSize] = useState<any>('small');
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [facultyName, setFacultyName] = useState<string>('');
  const [facilityInstitutionData, setFacilityInstitutionData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data from ElasticSearch and both APIs
    const fetchData = async () => {
      const esData = await getFacilityEsData();
      setEsData(esData);
      //console.log("Facility data is fetched");

      const institutionsResponse = await fetch('https://topology-institutions.osg-htc.org/api/institution_ids');
      const institutionsData = await institutionsResponse.json();
      // console.log("Institution data:", institutionsData);
      // console.log("Number of institutions:", Object.keys(institutionsData).length);

      const facilityResponse = await fetch('https://topology.opensciencegrid.org/miscfacility/json');
      const facilitiesData = await facilityResponse.json();
      // console.log("Facility data:", facilitiesData);
      // console.log("Number of facilities:", Object.keys(facilitiesData).length);

      // Create mapping of institution data by institutionId
      const institutionMap = institutionsData.reduce((acc, institution) => {
        const id = institution.id;
        if (!acc[id]) {
          acc[id] = [];
        }
        acc[id].push(institution);
        return acc;
      }, {});

      // Combine institution data with facility data
      // first use Object.entries to convert facilitiesData into an array of key-value pairs
      // key is the facilityName and value is the facilityInfo
      const combinedData = Object.entries(facilitiesData).map(([facilityName, facilityInfo]) => {
        const institutionId = facilityInfo.InstitutionID; //get the institutionId from the facilityInfo
        const institutionArray = institutionMap[institutionId] || []; // get the array of institutions grouped by institutionId
        return {
          facilityName,
          facilityID: facilityInfo.ID,
          isCCStar: facilityInfo.IsCCStar,
          institutions: institutionArray.map(institution => ({ // iterate through the InstitutionArray to get each institution
            ...institution, // spread the institution object
            esInfo: esData[facilityName] || null // Attach esData using the facilityName as the key
          }))
        };
      });

      setFacilityInstitutionData(combinedData);
      // console.log("Combined facility and institution data:", combinedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const currentZoom = map.getZoom();
    //console.log('Current zoom:', currentZoom);

    const newSize = currentZoom < 3 ? 'small' : 'large';
    if (markerSize !== newSize) {
      setMarkerSize(newSize);
    }
  }, [mapRef, markerSize]);

  // Set selected marker based on the faculty query parameter on mount
  useEffect(() => {
    if (faculty && facilityInstitutionData.length > 0) {
      const decodedFaculty = decodeURIComponent(faculty) // deocde the faculty name

      const matchedFacility = facilityInstitutionData.find(
          item => item.facilityName === decodedFaculty
      );

      if (matchedFacility && matchedFacility.institutions.length > 0) {
        const institution = matchedFacility.institutions[0];
        setSelectedMarker(institution);
        setFacultyName(decodedFaculty);
        centerToMarker(institution);
      }
    }
  }, [faculty, facilityInstitutionData]); // re-render when the faculty changes

  const handleResetNorth = () => {
    const map = mapRef.current.getMap();
    map.flyTo({
      zoom: 4.5,
      duration: 2000,
    });
  };

  const convertName = (facilityName: string) => {
    const convertedName = encodeURIComponent(facilityName);
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
    const handleMarkerClick = (institution: any, facilityName: any) => {
      setSelectedMarker(institution);
      const convertedName = convertName(facilityName);
      centerToMarker(institution);
      router.push(`/institutions?faculty=${convertedName}`);
    };

    const renderedMarkers = facilityInstitutionData.flatMap(facility =>
        facility.institutions.map(institution => {
          // extract the esData directly from the institution object as it was stored in it earlier
          const esInfo = institution.esInfo;

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
                    placement="top"
                >
                  <LocationOnIcon
                      color="primary"
                      className="hover:scale-150 transition duration-300 ease-in-out cursor-pointer"
                      fontSize={markerSize}
                      onClick={() => handleMarkerClick(institution, facility.facilityName)}
                  />
                </Tooltip>
              </Marker>
          );
        })
    ).filter(marker => marker !== null); // Filter out any null markers
    //console.log("Markers:", renderedMarkers);
    //console.log("Number of markers displayed on the map:", renderedMarkers.length);

    return renderedMarkers;
  }, [esData, markerSize, facilityInstitutionData, mapRef]);

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
