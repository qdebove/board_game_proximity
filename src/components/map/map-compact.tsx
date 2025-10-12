'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import type { MapContainerProps, TileLayerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(async () => (await import('react-leaflet')).MapContainer, { ssr: false });
const TileLayer = dynamic(async () => (await import('react-leaflet')).TileLayer, { ssr: false });
const Marker = dynamic(async () => (await import('react-leaflet')).Marker, { ssr: false });

interface MapCompactProps extends Partial<MapContainerProps> {
  points: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
  }>;
  tileLayerOptions?: TileLayerProps;
}

export function MapCompact({ points, tileLayerOptions, ...props }: MapCompactProps) {
  useEffect(() => {
    async function updateIcon() {
      const L = await import('leaflet');
      const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
      const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
      L.Icon.Default.mergeOptions({
        iconUrl,
        iconRetinaUrl: iconUrl,
        shadowUrl,
      });
    }
    updateIcon();
  }, []);

  const center = useMemo(() => {
    if (points.length === 0) {
      return { lat: 48.8566, lng: 2.3522 };
    }
    const lat = points.reduce((acc, point) => acc + point.lat, 0) / points.length;
    const lng = points.reduce((acc, point) => acc + point.lng, 0) / points.length;
    return { lat, lng };
  }, [points]);

  return (
    <div className="h-80 w-full overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }} {...props}>
        <TileLayer
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
          url={process.env.NEXT_PUBLIC_MAP_TILE_URL ?? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
          {...tileLayerOptions}
        />
        {points.map((point) => (
          <Marker key={point.id} position={[point.lat, point.lng]} title={point.title} />
        ))}
      </MapContainer>
    </div>
  );
}