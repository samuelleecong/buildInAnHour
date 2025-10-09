'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet
const fixLeafletDefaultIcon = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

export const LeafletSetup = () => {
  useEffect(() => {
    fixLeafletDefaultIcon();
  }, []);

  return null;
};
