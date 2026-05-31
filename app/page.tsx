'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback, useMemo } from 'react';
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

const LEVELS: CongestLevel[] = ['붐빔', '약간붐빔', '보통', '여유'];

export default function Home() {
  const [areas, setAreas] = useState<AreaData[]>([]);
  const [updatedAt, setUpdatedAt] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<CongestLevel | null>(null);

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

  // 지도 + 사이드바에 공통 적용되는 필터
  const displayAreas = useMemo(() => {
    return areas.filter((a) => {
      if (filterLevel && a.level !== filterLevel) return false;
      if (search && !a.name.includes(search)) return false;
      return true;
    });
  }, [areas, filterLevel, search]);

  return (
    <div className="flex h-screen w-full bg-[#0D1117] overflow-hidden">
      {/* 지도 */}
      <div className="flex-1 relative">
        <CongestMap areas={displayAreas} />

        {/* 상단 뱃지 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/75 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
          <span className="text-white font-semibold text-xs sm:text-sm">서울 실시간 혼잡도</span>
        </div>

        {/* 범례 + 필터 버튼 */}
        <div className="absolute bottom-6 left-4 z-[1000] bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 space-y-1">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(filterLevel === level ? null : level)}
              className={`flex items-center gap-1.5 w-full rounded px-2 py-1.5 transition-colors active:bg-white/20 ${filterLevel === level ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: LEVEL_COLOR[level], opacity: filterLevel && filterLevel !== level ? 0.3 : 1 }}
              />
              <span className={`text-xs ${filterLevel && filterLevel !== level ? 'text-gray-600' : 'text-gray-300'}`}>
                {level}
              </span>
            </button>
          ))}
          {filterLevel && (
            <button
              onClick={() => setFilterLevel(null)}
              className="text-[9px] text-gray-500 hover:text-gray-300 w-full text-center mt-1"
            >
              필터 해제
            </button>
          )}
        </div>

        {/* 사이드바 토글 버튼 */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="absolute top-4 right-4 z-[1000] bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg p-3.5 text-white hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
          aria-label="지역 목록 열기"
        >
          📊
        </button>
      </div>

      {/* 사이드바 */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[1500] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="
            fixed inset-y-0 right-0 z-[2000] w-full max-w-sm
            md:relative md:inset-auto md:z-auto md:w-72
            bg-[#161B22] border-l border-[#21262D] flex flex-col overflow-hidden
          ">
            {/* 헤더 */}
            <div className="p-4 border-b border-[#21262D]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-white font-bold text-base">지역별 혼잡도</h2>
                  <p className="text-orange-400 text-xs mt-0.5">
                    {displayAreas.length}/{areas.length}개 지역
                  </p>
                  {updatedAt && (
                    <p className="text-gray-500 text-xs mt-0.5">{updatedAt} 기준</p>
                  )}
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white text-xl leading-none mt-0.5 p-1"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>

              {/* 검색창 */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="지역 검색..."
                className="w-full bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
              />

              {/* 레벨 필터 */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(filterLevel === level ? null : level)}
                    className="px-2 py-1 rounded-full text-[10px] font-bold transition-all"
                    style={{
                      color: LEVEL_COLOR[level],
                      backgroundColor: filterLevel === level ? `${LEVEL_COLOR[level]}33` : 'transparent',
                      border: `1px solid ${filterLevel === level ? LEVEL_COLOR[level] : '#21262D'}`,
                    }}
                  >
                    {level}
                  </button>
                ))}
                {(filterLevel || search) && (
                  <button
                    onClick={() => { setFilterLevel(null); setSearch(''); }}
                    className="px-2 py-1 rounded-full text-[10px] text-gray-500 border border-[#21262D] hover:text-gray-300"
                  >
                    초기화
                  </button>
                )}
              </div>
            </div>

            {/* 목록 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {areas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">데이터 불러오는 중...</p>
                </div>
              ) : displayAreas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">검색 결과 없음</p>
                </div>
              ) : (
                displayAreas.map((area, idx) => (
                  <div key={area.name} className="bg-[#0D1117] rounded-lg p-3 border border-[#21262D]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs text-gray-500 w-5 shrink-0">{idx + 1}</span>
                        <span className="text-white text-sm font-medium truncate">{area.name}</span>
                      </div>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-1"
                        style={{ color: LEVEL_COLOR[area.level], backgroundColor: `${LEVEL_COLOR[area.level]}22` }}
                      >
                        {area.level}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 pl-6">
                      {area.min.toLocaleString()}~{area.max.toLocaleString()}명
                    </p>
                    {/* 다음 혼잡 예정 표시 */}
                    {area.forecast?.find(f => f.level === '붐빔' || f.level === '약간붐빔') && area.level === '여유' && (
                      <p className="text-orange-500 text-[10px] mt-1 pl-6">
                        ⚠ {area.forecast.find(f => f.level === '붐빔' || f.level === '약간붐빔')!.time.slice(11, 16)} 혼잡 예정
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
