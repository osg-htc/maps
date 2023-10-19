import Head from "next/head";
import { useEffect, useState } from "react";
import mapboxgl from 'mapbox-gl';  // Importing mapbox-gl directly
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import '../app/globals.css';

export const GlobeComponent = () => {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [popoverContent, setPopoverContent] = useState<string>('');

    useEffect(() => {
        // Ensure mapbox-gl is used in client-side only
        if (typeof window !== 'undefined') {
            mapboxgl.accessToken = 'pk.eyJ1IjoiYWJha2lyY2kiLCJhIjoiY2xub3NtbHp0MDR2bDJ6bnc4bWt2ZjlzcCJ9.wGS87zkq2AG2TQgB3OwoHw';
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/abakirci/clnoygvzg009b01qugzla69w9',
                center: [-89.4081, 43.0733],
                zoom: 1
            });

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

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            {/* Adding the Head component here */}
            <Head>
                <link
                    rel="stylesheet"
                    href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
                />
            </Head>

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
        </div>
    );
}
