'use client';

import Link from 'next/link';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import type { MapContainerProps, TileLayerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(async () => (await import('react-leaflet')).MapContainer, { ssr: false });
const TileLayer = dynamic(async () => (await import('react-leaflet')).TileLayer, { ssr: false });
const Marker = dynamic(async () => (await import('react-leaflet')).Marker, { ssr: false });
const Popup = dynamic(async () => (await import('react-leaflet')).Popup, { ssr: false });

interface MapCompactProps extends Partial<MapContainerProps> {
  points: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
    href?: string;
  }>;
  tileLayerOptions?: TileLayerProps;
  className?: string;
  showPopups?: boolean;
}

export function MapCompact({
  points,
  tileLayerOptions,
  className,
  showPopups = true,
  ...props
}: MapCompactProps) {
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

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  const tileUrl = maptilerKey
    ? `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${maptilerKey}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution = maptilerKey
    ? "&copy; <a href='https://www.maptiler.com/copyright/'>MapTiler</a> & <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
    : "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>";

  return (
    <div
      className={clsx(
        'h-80 w-full overflow-hidden rounded-2xl border border-slate-200',
        className,
      )}
    >
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }} {...props}>
        <TileLayer attribution={attribution} url={tileUrl} {...tileLayerOptions} />
        {points.map((point) => (
          <Marker key={point.id} position={[point.lat, point.lng]} title={point.title}>
            {showPopups ? (
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{point.title}</p>
                  {point.description ? (
                    <p className="text-sm text-slate-600">{point.description}</p>
                  ) : null}
                  {point.href ? (
                    <Link
                      href={point.href}
                      className="inline-flex items-center text-sm font-medium text-brand-700 hover:text-brand-900"
                    >
                      Voir la session
                    </Link>
                  ) : null}
                </div>
              </Popup>
            ) : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}