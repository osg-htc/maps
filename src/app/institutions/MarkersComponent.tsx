import React, { useState, useEffect, useMemo } from 'react';
import { Marker } from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from '@mui/material';
import { getFacilityEsData } from '@/data/eqInstitutions';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

type MarkersProps = {
  mapRef: React.RefObject<any>;
  zoom: number;
};

const MarkersComponent: React.FC<MarkersProps> = ({ mapRef, zoom }) => {
  const [esData, setEsData] = useState<any>({});
  const [markerSize, setMarkerSize] = useState<any>('small');
  const [selectedMarker, setSelectedMarker] = useState<any | null>(
      null
  );
  const [facultyName, setFacultyName] = useState<string>('');
  const navigate = useNavigate()
  const [institutions, setInstitutions] = useState<any[]>([]);

  useEffect(() => {
    const zoomRate = (zoom: number) => {
      if (zoom < 3) {
        setMarkerSize('small');
      } else {
        setMarkerSize('large');
      }
    };
    // Fetch the ElasticSearch data when the component mounts
    const fetchData = async () => {
      const data = await getFacilityEsData();
      setEsData(data);
    };

    const fetchInstitutions = async () => {
      try{
        const response = await fetch('https://topology-institutions.osg-htc.org/api/institution_ids')
        const data = await response.json()
        setInstitutions(data)
        //console.log("data:", data)
      } catch(error) {
        console.error(error)
      }
    }

    fetchData();
    fetchInstitutions()
    zoomRate(zoom);
  }, [zoom]);

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
    navigate(`/maps/institutions`);
    setSelectedMarker(null);
    handleResetNorth();
  };

  const markers = useMemo(() => {
    const handleMarkerClick = (institution: any) => {
      setSelectedMarker(institution);
      const convertedName = convertName(institution);
      centerToMarker(institution);
      navigate(`/maps/institutions?faculty=${convertedName}`);
    };

    const centerToMarker = (institution: any) => {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [institution.longitude, institution.latitude],
        zoom: 8,
        duration: 2000,
      });
    };

    return institutions.map((institution) => {
      const institutionName = institution.name;
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
  }, [esData, markerSize, navigate, mapRef, institutions]);

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
