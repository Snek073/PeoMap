'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import type { AreaData, CongestLevel } from '@/app/api/citydata/route';

const SEOUL_CENTER: [number, number] = [37.5665, 126.9780];
const LABEL_ZOOM = 12;

const LEVEL_COLOR: Record<CongestLevel, string> = {
  '여유': '#22c55e',
  '보통': '#eab308',
  '약간붐빔': '#f97316',
  '붐빔': '#ef4444',
};

function radius(min: number, max: number) {
  const avg = (min + max) / 2;
  if (avg > 100000) return 20;
  if (avg > 50000) return 15;
  if (avg > 20000) return 11;
  return 8;
}

function worstLevel(levels: string[]): CongestLevel {
  if (levels.includes('붐빔')) return '붐빔';
  if (levels.includes('약간붐빔')) return '약간붐빔';
  if (levels.includes('보통')) return '보통';
  return '여유';
}

interface Props {
  areas: AreaData[];
  userLocation?: [number, number] | null;
  selectedArea?: { name: string; ts: number } | null;
}

export default function CongestMap({ areas, userLocation, selectedArea }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef = useRef<any>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const markerMapRef = useRef<Map<string, L.CircleMarker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: SEOUL_CENTER,
      zoom: 12,
      minZoom: 10,
      maxZoom: 17,
      maxBounds: L.latLngBounds(L.latLng(37.25, 126.60), L.latLng(37.82, 127.45)),
      maxBoundsViscosity: 1.0,
      zoomControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cluster = (L as any).markerClusterGroup({
      maxClusterRadius: 70,
      disableClusteringAtZoom: 12,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      iconCreateFunction: (c: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const levels = c.getAllChildMarkers().map((m: any) => m.options.congestLevel as string);
        const worst = worstLevel(levels);
        const color = LEVEL_COLOR[worst];
        return L.divIcon({
          html: `<div style="background:${color};color:#fff;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:2px solid rgba(255,255,255,0.25);box-shadow:0 2px 8px rgba(0,0,0,0.6);">${c.getChildCount()}</div>`,
          className: '',
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });
      },
    });
    cluster.addTo(map);
    clusterRef.current = cluster;
    mapRef.current = map;

    const updateLabels = () => {
      const show = map.getZoom() >= LABEL_ZOOM;
      document.querySelectorAll('.area-label').forEach((el) => {
        (el as HTMLElement).style.display = show ? '' : 'none';
      });
    };
    map.on('zoomend', updateLabels);

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }
    if (!userLocation) return;
    const marker = L.circleMarker(userLocation, {
      radius: 9,
      fillColor: '#3b82f6',
      color: '#fff',
      fillOpacity: 0.95,
      weight: 2.5,
    }).bindTooltip('현재 위치', { direction: 'top' });
    marker.addTo(mapRef.current);
    userMarkerRef.current = marker;
    mapRef.current.flyTo(userLocation, 14, { duration: 1.2 });
  }, [userLocation]);

  useEffect(() => {
    if (!selectedArea || !mapRef.current) return;
    const marker = markerMapRef.current.get(selectedArea.name);
    if (!marker) return;
    mapRef.current.flyTo(marker.getLatLng(), 15, { duration: 0.8 });
    setTimeout(() => marker.openPopup(), 900);
  }, [selectedArea]);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster || !mapRef.current) return;
    cluster.clearLayers();
    markerMapRef.current.clear();
    const showLabel = mapRef.current.getZoom() >= LABEL_ZOOM;

    for (const area of areas) {
      const color = LEVEL_COLOR[area.level] ?? '#6b7280';
      const r = radius(area.min, area.max);
      const nextCrowded = area.forecast?.find(
        (f) => f.level === '붐빔' || f.level === '약간붐빔'
      );

      const marker = L.circleMarker([area.lat, area.lng], {
        radius: r,
        fillColor: color,
        color: '#000',
        fillOpacity: 0.8,
        weight: 1,
      })
        .bindTooltip(area.name, {
          permanent: true,
          direction: 'right',
          className: 'area-label',
          offset: [r + 4, 0],
        })
        .bindPopup(() => {
          const wrap = document.createElement('div');
          wrap.style.cssText = 'font-family:sans-serif;min-width:160px;font-size:13px';

          const title = document.createElement('strong');
          title.style.cssText = 'display:block;margin-bottom:6px;font-size:14px';
          title.textContent = area.name;

          const lvl = document.createElement('span');
          lvl.style.cssText = `display:inline-block;padding:2px 8px;border-radius:12px;font-weight:700;font-size:12px;color:#fff;background:${color};margin-bottom:6px`;
          lvl.textContent = area.level;

          const pop = document.createElement('p');
          pop.style.cssText = 'margin:0 0 6px;color:#555;font-size:12px';
          pop.textContent = `${area.min.toLocaleString()}~${area.max.toLocaleString()}명`;

          wrap.append(title, lvl, pop);

          if (area.forecast?.length > 0) {
            const fcstTitle = document.createElement('p');
            fcstTitle.style.cssText = 'margin:0 0 4px;font-weight:600;font-size:12px;color:#333';
            fcstTitle.textContent = '예측 혼잡도';
            wrap.appendChild(fcstTitle);

            const table = document.createElement('div');
            table.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:2px 8px';
            for (const f of area.forecast) {
              const timeEl = document.createElement('span');
              timeEl.style.cssText = 'font-size:11px;color:#666';
              timeEl.textContent = f.time.slice(11, 16);

              const levelEl = document.createElement('span');
              levelEl.style.cssText = `font-size:11px;font-weight:600;color:${LEVEL_COLOR[f.level] ?? '#999'}`;
              levelEl.textContent = f.level;

              table.append(timeEl, levelEl);
            }
            wrap.appendChild(table);

            if (nextCrowded) {
              const warn = document.createElement('p');
              warn.style.cssText = 'margin:6px 0 0;font-size:11px;color:#f97316;font-weight:600';
              warn.textContent = `⚠ ${nextCrowded.time.slice(11, 16)} 혼잡 예정`;
              wrap.appendChild(warn);
            }
          }

          const time = document.createElement('p');
          time.style.cssText = 'margin:6px 0 0;color:#aaa;font-size:10px';
          time.textContent = `${area.updatedAt} 기준`;
          wrap.appendChild(time);

          return wrap;
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (marker.options as any).congestLevel = area.level;
      markerMapRef.current.set(area.name, marker);
      cluster.addLayer(marker);
    }

    document.querySelectorAll('.area-label').forEach((el) => {
      (el as HTMLElement).style.display = showLabel ? '' : 'none';
    });
  }, [areas]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 z-[1000] text-[10px] text-gray-500">
        서울특별시 공공데이터 활용
      </div>
    </div>
  );
}
