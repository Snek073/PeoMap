'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// leaflet.heat 타입 선언
declare module 'leaflet' {
  function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: {
      minOpacity?: number;
      maxZoom?: number;
      max?: number;
      radius?: number;
      blur?: number;
      gradient?: Record<string, string>;
    },
  ): L.Layer;
}

interface HeatMapProps {
  points: Array<{ lat: number; lng: number; intensity?: number }>;
  totalUsers: number;
}

const KOREA_CENTER: [number, number] = [36.5, 127.8];

export default function HeatMap({ points, totalUsers }: HeatMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatRef = useRef<L.Layer | null>(null);

  // 지도 초기화 (최초 1회)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: KOREA_CENTER,
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 히트맵 데이터 업데이트
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet.heat').then(() => {
      if (!mapRef.current) return;

      if (heatRef.current) {
        mapRef.current.removeLayer(heatRef.current);
      }

      const heatData: Array<[number, number, number]> = points.map((p) => [
        p.lat,
        p.lng,
        p.intensity ?? 0.8,
      ]);

      const heat = L.heatLayer(heatData, {
        radius: 35,
        blur: 25,
        maxZoom: 17,
        max: 1.0,
        minOpacity: 0.3,
        gradient: {
          0.0: '#0033ff',
          0.3: '#00cc66',
          0.6: '#ffcc00',
          0.85: '#ff6600',
          1.0: '#ff0000',
        },
      });

      heat.addTo(mapRef.current);
      heatRef.current = heat;
    });
  }, [points]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* 실시간 뱃지 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/75 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-white font-semibold text-sm">
          실시간 인구 지도
        </span>
        <span className="text-orange-400 font-bold text-sm">
          {totalUsers.toLocaleString()}명 활성
        </span>
      </div>
    </div>
  );
}
