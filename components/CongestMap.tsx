'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { AreaData, CongestLevel } from '@/app/api/citydata/route';

const SEOUL_CENTER: [number, number] = [37.5665, 126.9780];

const LEVEL_COLOR: Record<CongestLevel, string> = {
  '여유': '#22c55e',
  '보통': '#eab308',
  '약간붐빔': '#f97316',
  '붐빔': '#ef4444',
};

function radius(min: number, max: number) {
  const avg = (min + max) / 2;
  if (avg > 100000) return 22;
  if (avg > 50000) return 17;
  if (avg > 20000) return 13;
  return 10;
}

interface Props {
  areas: AreaData[];
}

export default function CongestMap({ areas }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: SEOUL_CENTER,
      zoom: 11,
      minZoom: 9,
      maxBounds: L.latLngBounds(L.latLng(37.2, 126.5), L.latLng(37.9, 127.5)),
      maxBoundsViscosity: 1.0,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.clearLayers();
    for (const area of areas) {
      const color = LEVEL_COLOR[area.level] ?? '#6b7280';
      L.circleMarker([area.lat, area.lng], {
        radius: radius(area.min, area.max),
        fillColor: color,
        color: '#000',
        fillOpacity: 0.75,
        weight: 1,
      })
        .bindPopup(
          `<div style="font-family:sans-serif;min-width:130px">
            <strong>${area.name}</strong><br/>
            <span style="color:${color}">${area.level}</span><br/>
            ${area.min.toLocaleString()}~${area.max.toLocaleString()}명<br/>
            <small style="color:#999">${area.updatedAt}</small>
          </div>`
        )
        .addTo(layerRef.current!);
    }
  }, [areas]);

  return <div ref={containerRef} className="w-full h-full" />;
}
