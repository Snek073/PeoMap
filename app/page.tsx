'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback } from 'react';
import type { AreaData, CongestLevel } from './api/citydata/route';

const CongestMap = dynamic(() => import('../components/CongestMap'), {
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

const LEVEL_ORDER: Record<CongestLevel, number> = {
  '붐빔': 4, '약간붐빔': 3, '보통': 2, '여유': 1,
};

const LEVEL_COLOR: Record<CongestLevel, string> = {
  '여유': '#22c55e',
  '보통': '#eab308',
  '약간붐빔': '#f97316',
  '붐빔': '#ef4444',
};

export default function Home() {
  const [areas, setAreas] = useState<AreaData[]>([]);
  const [updatedAt, setUpdatedAt] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/citydata');
      const data: AreaData[] = await res.json();
      const sorted = data.sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]);
      setAreas(sorted);
      if (sorted[0]) setUpdatedAt(sorted[0].updatedAt);
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const crowded = areas.filter((a) => a.level === '붐빔').length;

  return (
    <div className="flex h-screen w-full bg-[#0D1117] overflow-hidden">
      <div className="flex-1 relative">
        <CongestMap areas={areas} />

        {/* 상단 뱃지 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/75 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-white font-semibold text-sm">서울 실시간 혼잡도</span>
          {areas.length > 0 && (
            <span className="text-orange-400 font-bold text-sm">붐빔 {crowded}곳</span>
          )}
        </div>

        {/* 범례 */}
        <div className="absolute bottom-8 right-4 z-[1000] bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl p-3 space-y-1.5">
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-2">혼잡도</p>
          {(['여유', '보통', '약간붐빔', '붐빔'] as CongestLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLOR[level] }} />
              <span className="text-gray-300 text-xs">{level}</span>
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

      {/* 사이드바 */}
      {sidebarOpen && (
        <div className="w-72 bg-[#161B22] border-l border-[#21262D] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#21262D]">
            <h2 className="text-white font-bold text-base">📊 지역별 혼잡도</h2>
            <p className="text-orange-400 text-sm mt-1 font-semibold">
              총 {areas.length}개 지역 모니터링
            </p>
            {updatedAt && (
              <p className="text-gray-500 text-xs mt-0.5">{updatedAt} 기준</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {areas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">데이터 불러오는 중...</p>
              </div>
            ) : (
              areas.map((area, idx) => (
                <div key={area.name} className="bg-[#0D1117] rounded-lg p-3 border border-[#21262D]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 w-5">{idx + 1}</span>
                      <span className="text-white text-sm font-medium">{area.name}</span>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ color: LEVEL_COLOR[area.level], backgroundColor: `${LEVEL_COLOR[area.level]}22` }}
                    >
                      {area.level}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 pl-6">
                    {area.min.toLocaleString()}~{area.max.toLocaleString()}명
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
