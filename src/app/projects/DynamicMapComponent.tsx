import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MapComponent from './MapComponent';

const DynamicMapComponent: React.FC = () => (
    <BrowserRouter>
        <MapComponent />
    </BrowserRouter>
);

export default DynamicMapComponent;