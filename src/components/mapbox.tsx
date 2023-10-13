import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import { MapMouseEvent } from 'mapbox-gl';
import { Button, PopoverBody, UncontrolledPopover } from "reactstrap";
import '../app/globals.css';

export const GlobeComponent = () => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverContent, setPopoverContent] = useState('');

    useEffect(() => {
        // Only import mapbox-gl in useEffect to avoid server-side issues
        const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

        mapboxgl.accessToken = 'pk.eyJ1IjoiYWJha2lyY2kiLCJhIjoiY2xub3NtbHp0MDR2bDJ6bnc4bWt2ZjlzcCJ9.wGS87zkq2AG2TQgB3OwoHw';
        const map = new mapboxgl.Map({
            container: 'map',
            style:  'mapbox://styles/abakirci/clnoygvzg009b01qugzla69w9',
            center: [-89.4081, 43.0733],
            zoom: 1
        });

        // Click event handler
        const handleMapClick = (event: MapMouseEvent) => {
            const features = event.target.queryRenderedFeatures(event.point, {
                layers: ['institutions'] // replace with your layer name
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
                setPopoverOpen(true);
            }
        }

        map.on('click', handleMapClick);

        // Cleanup on component unmount
        return () => {
            map.off('click', handleMapClick); // Remove click listener
            map.remove(); // Remove the map instance
        }
    }, []);

    return (
        <div>
            {/* Adding the Head component here */}
            <Head>
                <link
                    rel="stylesheet"
                    href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
                />
            </Head>

            <Button id="mapPopoverTarget" type="button" style={{ display: 'none' }}></Button>
            <UncontrolledPopover isOpen={popoverOpen} toggle={() => setPopoverOpen(false)} target="mapPopoverTarget" placement="top">
                <PopoverBody dangerouslySetInnerHTML={{ __html: popoverContent }}></PopoverBody>
            </UncontrolledPopover>

            <div id={'map'}></div>
        </div>
    )
}
