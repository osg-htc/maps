'use client'

import { useEffect } from 'react';
import { useMap } from 'react-map-gl/mapbox';

export default function DisableMapControls() {
  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;
    const mb = map.getMap();
    mb.scrollZoom.disable();
    mb.dragPan.disable();
    mb.dragRotate.disable();
    mb.doubleClickZoom.disable();
    mb.touchZoomRotate.disable();
    mb.keyboard.disable();
  }, [map]);

  return null;
}