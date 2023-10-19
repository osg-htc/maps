import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import '../app/globals.css';
import { ThemeProvider, createTheme} from '@mui/material/styles';
import * as mapboxgl from 'mapbox-gl';

interface Institution {
    name: string;
    coordinates: [number, number];
  }
  
  interface Feature {
    properties: {
      'Institution Name': string;
    };
    geometry: {
      coordinates: [number, number];
    };
  }
  
  interface GeoJSONData {
    features: Feature[];
  }

export const GlobeComponent = () => {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [popoverContent, setPopoverContent] = useState<string>('');
    const mapRef = useRef<mapboxgl.Map | null>(null as any);
    const [institutionData, setInstitutionData] = useState<Institution[]>([]);

    const theme = createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#3f51b5',
          },
          secondary: {
            main: '#f50057',
          },
        },
      });

    useEffect(() => {
        // Ensure mapbox-gl is used in client-side only
        if (typeof window !== 'undefined') {
            mapboxgl.accessToken = 'pk.eyJ1IjoiYWJha2lyY2kiLCJhIjoiY2xub3NtbHp0MDR2bDJ6bnc4bWt2ZjlzcCJ9.wGS87zkq2AG2TQgB3OwoHw';
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/abakirci/clnoygvzg009b01qugzla69w9',
                center: [-89.4081, 43.0733],
                zoom: 2
            });

            mapRef.current = map;

        // Fetch the institution data from the local JSON file
        fetch('/features.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data: GeoJSONData) => {
            const institutions = data.features.map(feature => ({
                name: feature.properties['Institution Name'],
                coordinates: feature.geometry.coordinates,
            }));
            setInstitutionData(institutions);
        })
        .catch(error => console.error('Error fetching institution data:', error));




            // Click event handler
            const handleMapClick = (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
                const features = event.target.queryRenderedFeatures(event.point, {
                    layers: ['institutions']  // replace with your layer name
                });

                if (!features.length) {
                    return;
                }

                const feature = features[0];

                if (feature.geometry.type === 'Point' && feature.properties) {
                    const coordinates: [number, number] = feature.geometry.coordinates as [number, number];
                    const content = `
                        <h3>${feature.properties["Institution Name"]}</h3>
                        <p>Coordinates: ${coordinates.join(', ')}</p>
                    `;

                    setPopoverContent(content);
                    setAnchorEl(event.originalEvent.currentTarget);
                }
            }

            map.on('click', handleMapClick);

            // Cleanup on component unmount
            return () => {
                map.off('click', handleMapClick);  // Remove click listener
                map.remove();  // Remove the map instance
            }
        }
    }, []);

    const handleInstitutionSelect = (event: any, value: Institution | null) => {
        if (value && mapRef.current) {
          const { coordinates } = value;
          mapRef.current.flyTo({
            center: coordinates,
            essential: true,
            zoom:6
          });
        }
      };

    const resetMap = () => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [-89.4081, 43.0733],
                zoom: 1,
                essential: true  // this animation is considered essential with respect to prefers-reduced-motion
            });
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <ThemeProvider theme={theme}>
        <Container>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
                />
            </Head>
            <CssBaseline />
            <Paper sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap',  // Ensures buttons wrap onto next line if there's not enough space
                    p: 2  // Adds some padding around the buttons
                }} 
                elevation={3}
            >   
                <Typography variant="h4">
                OSG Map
                </Typography>
                <Button variant="contained" color="primary" onClick={resetMap}>
                    Reset Map
                </Button>
                <Autocomplete
                    options={institutionData}
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    onChange={handleInstitutionSelect}
                    renderInput={(params) => <TextField {...params} label="Search Institutions" />}
                />
            </Paper>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography sx={{ padding: 2 }} dangerouslySetInnerHTML={{ __html: popoverContent }} />
            </Popover>
            
            <div id={'map'}></div>
        </Container>
        </ThemeProvider>
    );
}