'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

const HeatMap = dynamic(() => import('../components/HeatMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0D1117]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">지도 불러오는 중...</p>
      </div>
    </div>
  ),
});

interface Ping {
  lat: number;
  lng: number;
}

interface RegionStat {
  label: string;
  count: number;
  lat: number;
  lng: number;
}

const ACTIVE_MINUTES = 30;
const PING_KEY = 'peomap_pinged_at';

function coordToLabel(lat: number, lng: number): string {
  if (lat >= 37.4 && lat <= 37.7 && lng >= 126.8 && lng <= 127.2) return '서울';
  if (lat >= 37.3 && lat <= 37.6 && lng >= 126.6 && lng <= 127.0) return '인천';
  if (lat >= 37.3 && lat <= 38.0 && lng >= 127.0 && lng <= 127.8) return '경기도';
  if (lat >= 35.8 && lat <= 36.0 && lng >= 128.5 && lng <= 128.7) return '대구';
  if (lat >= 35.1 && lat <= 35.2 && lng >= 129.0 && lng <= 129.2) return '부산';
  if (lat >= 36.3 && lat <= 36.5 && lng >= 127.3 && lng <= 127.5) return '대전';
  if (lat >= 35.1 && lat <= 35.2 && lng >= 126.8 && lng <= 127.0) return '광주';
  if (lat >= 35.5 && lat <= 36.5 && lng >= 128.0 && lng <= 129.5) return '경상북도';
  if (lat >= 34.8 && lat <= 35.5 && lng >= 128.0 && lng <= 129.5) return '경상남도';
  if (lat >= 34.0 && lat <= 35.0 && lng >= 126.0 && lng <= 127.5) return '전라남도';
  if (lat >= 35.5 && lat <= 36.5 && lng >= 126.5 && lng <= 128.0) return '전라북도';
  if (lat >= 36.5 && lat <= 37.5 && lng >= 127.5 && lng <= 129.5) return '충청북도';
  if (lat >= 36.0 && lat <= 37.2 && lng >= 126.3 && lng <= 127.5) return '충청남도';
  if (lat >= 37.0 && lat <= 38.6 && lng >= 127.5 && lng <= 129.5) return '강원도';
  if (lat >= 33.0 && lat <= 33.7 && lng >= 126.0 && lng <= 127.0) return '제주';
  return `${lat.toFixed(1)}°N ${lng.toFixed(1)}°E`;
}

function buildRegionStats(pings: Ping[]): RegionStat[] {
  const grid: Record<string, { lat: number; lng: number; count: number }> = {};
  for (const p of pings) {
    const key = `${p.lat.toFixed(2)},${p.lng.toFixed(2)}`;
    if (!grid[key]) grid[key] = { lat: p.lat, lng: p.lng, count: 0 };
    grid[key].count++;
  }
  return Object.values(grid)
    .map((g) => ({ label: coordToLabel(g.lat, g.lng), count: g.count, lat: g.lat, lng: g.lng }))
    .sort((a, b) => b.count - a.count);
}

export default function Home() {
  const [pings, setPings] = useState<Ping[]>([]);
  const [regions, setRegions] = useState<RegionStat[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPings = useCallback(async () => {
    const since = new Date(Date.now() - ACTIVE_MINUTES * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('location_pings')
      .select('lat, lng')
      .gte('created_at', since)
      .gte('lat', 33.0).lte('lat', 38.9)
      .gte('lng', 124.5).lte('lng', 130.0)
      .limit(5000);
    if (data) {
      setPings(data);
      setRegions(buildRegionStats(data));
    }
  }, []);

  const maybePing = useCallback(() => {
    const lastPing = localStorage.getItem(PING_KEY);
    const now = Date.now();
    if (!lastPing || now - parseInt(lastPing) > ACTIVE_MINUTES * 60 * 1000) {
      fetch('/api/ping', { method: 'POST' })
        .then((r) => r.json())
        .then((data) => {
          if (data.ok) localStorage.setItem(PING_KEY, Date.now().toString());
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    fetchPings();
    maybePing();
    timerRef.current = setInterval(() => {
      maybePing();
      fetchPings();
    }, ACTIVE_MINUTES * 60 * 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const ch = supabase
      .channel('realtime_pings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'location_pings' }, fetchPings)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchPings]);

  const heatPoints = pings.map((p) => ({ lat: p.lat, lng: p.lng }));
  const topRegions = regions.slice(0, 20);
  const maxCount = topRegions[0]?.count ?? 1;

  return (
    <div className="flex h-screen w-full bg-[#0D1117] overflow-hidden">
      <div className="flex-1 relative">
        <HeatMap points={heatPoints} totalUsers={pings.length} />

        {/* 범례 */}
        <div className="absolute bottom-8 right-4 z-[1000] bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl p-3 space-y-1.5">
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-2">밀도</p>
          {[
            { color: '#0033ff', label: '낮음' },
            { color: '#00cc66', label: '보통' },
            { color: '#ffcc00', label: '높음' },
            { color: '#ff6600', label: '매우 높음' },
            { color: '#ff0000', label: '극도로 높음' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-300 text-xs">{item.label}</span>
            </div>
          ))}
        </div>

        {/* 사이드바 토글 */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="absolute top-4 right-4 z-[1000] bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
        >
          {sidebarOpen ? '▶' : '◀'}
        </button>
      </div>

      {/* 통계 사이드바 */}
      {sidebarOpen && (
        <div className="w-72 bg-[#161B22] border-l border-[#21262D] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#21262D]">
            <h2 className="text-white font-bold text-base">📊 지역별 현황</h2>
            <p className="text-orange-400 text-sm mt-1 font-semibold">
              최근 {ACTIVE_MINUTES}분 · {pings.length.toLocaleString()}명 활성
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              {new Date().toLocaleTimeString('ko-KR')} 기준
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {topRegions.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-gray-400 text-sm">아직 데이터가 없습니다</p>
                <p className="text-gray-600 text-xs">방문자 위치가 자동으로 표시됩니다</p>
              </div>
            ) : (
              topRegions.map((region, idx) => {
                const pct = (region.count / maxCount) * 100;
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
                return (
                  <div
                    key={`${region.lat}-${region.lng}`}
                    className="bg-[#0D1117] rounded-lg p-3 border border-[#21262D] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 w-5">
                          {medal ?? `${idx + 1}`}
                        </span>
                        <span className="text-white text-sm font-medium">{region.label}</span>
                      </div>
                      <span className="text-orange-400 text-sm font-bold">{region.count}명</span>
                    </div>
                    <div className="h-1.5 bg-[#21262D] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
