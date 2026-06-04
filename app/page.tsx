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

function AreaCard({ area, idx, isFavorite, onToggle, onSelect }: {
  area: AreaData; idx?: number; isFavorite: boolean; onToggle: (name: string) => void; onSelect: (name: string) => void;
}) {
  return (
    <div
      className="bg-[#0D1117] rounded-lg p-3 border border-[#21262D] cursor-pointer hover:border-[#30363D] active:bg-white/5 transition-colors"
      onClick={() => onSelect(area.name)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          {idx !== undefined && <span className="text-xs text-gray-500 w-5 shrink-0">{idx + 1}</span>}
          <span className="text-white text-sm font-medium truncate">{area.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(area.name); }}
            className="text-base leading-none p-2 rounded transition-colors hover:opacity-80"
            style={{ color: isFavorite ? '#eab308' : '#4b5563' }}
            aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ color: LEVEL_COLOR[area.level], backgroundColor: `${LEVEL_COLOR[area.level]}22` }}
          >
            {area.level}
          </span>
        </div>
      </div>
      <p className={`text-gray-500 text-xs mt-1 ${idx !== undefined ? 'pl-6' : 'pl-1'}`}>
        {area.min.toLocaleString()}~{area.max.toLocaleString()}명
      </p>
      {area.forecast?.find(f => f.level === '붐빔' || f.level === '약간붐빔') && area.level === '여유' && (
        <p className="text-orange-500 text-[10px] mt-1 pl-6">
          ⚠ {area.forecast.find(f => f.level === '붐빔' || f.level === '약간붐빔')!.time.slice(11, 16)} 혼잡 예정
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [areas, setAreas] = useState<AreaData[]>([]);
  const [updatedAt, setUpdatedAt] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<CongestLevel | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [hideYeoyu, setHideYeoyu] = useState(true);
  const [selectedArea, setSelectedArea] = useState<{ name: string; ts: number } | null>(null);
  const [lastFetched, setLastFetched] = useState(0);
  const [elapsed, setElapsed] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem('peomap_favorites');
      if (saved) setFavorites(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggleFavorite = useCallback((name: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      try { localStorage.setItem('peomap_favorites', JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation([pos.coords.latitude, pos.coords.longitude]); setLocationLoading(false); },
      () => { setLocationLoading(false); setLocationError(true); },
    );
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/citydata');
      const data: AreaData[] = await res.json();
      const sorted = data.sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]);
      setAreas(sorted);
      if (sorted[0]) setUpdatedAt(sorted[0].updatedAt);
      setLastFetched(Date.now());
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [fetchData]);

  useEffect(() => {
    if (!lastFetched) return;
    const update = () => {
      const s = Math.floor((Date.now() - lastFetched) / 1000);
      if (s < 30) setElapsed('방금 전');
      else if (s < 3600) setElapsed(`${Math.floor(s / 60)}분 전`);
      else setElapsed(`${Math.floor(s / 3600)}시간 전`);
    };
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, [lastFetched]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData, isRefreshing]);

  const handleAreaSelect = useCallback((name: string) => {
    setSelectedArea({ name, ts: Date.now() });
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const displayAreas = useMemo(() => {
    return areas.filter((a) => {
      if (filterLevel && a.level !== filterLevel) return false;
      if (search && !a.name.includes(search)) return false;
      return true;
    });
  }, [areas, filterLevel, search]);

  const favoriteAreas = useMemo(() => areas.filter(a => favorites.has(a.name)), [areas, favorites]);
  const normalAreas = useMemo(
    () => displayAreas.filter(a => !favorites.has(a.name) && !(hideYeoyu && a.level === '여유')),
    [displayAreas, favorites, hideYeoyu]
  );

  return (
    <div className="flex h-dvh w-full bg-[#0D1117] overflow-hidden">
      {/* 지도 */}
      <div className="flex-1 relative">
        <CongestMap areas={displayAreas} userLocation={userLocation} selectedArea={selectedArea} />

        {/* 상단 뱃지 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[1000] bg-black/75 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 whitespace-nowrap"
          style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
          <span className="text-white font-semibold text-xs sm:text-sm">서울 실시간 혼잡도</span>
          {elapsed && (
            <>
              <span className="hidden sm:inline text-gray-600 text-xs">·</span>
              <span className="hidden sm:inline text-gray-400 text-[10px]">{elapsed}</span>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-40 p-1 -m-1"
                aria-label="새로고침"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isRefreshing ? 'animate-spin' : ''}>
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* 범례 + 필터 버튼 */}
        <div
          className="absolute left-4 z-[1000] bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 space-y-1"
          style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
        >
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
          className="absolute right-4 z-[1000] bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg p-3.5 text-white hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
          style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
          aria-label="지역 목록 열기"
        >
          📊
        </button>

        {/* 내 위치 버튼 */}
        <button
          onClick={handleGetLocation}
          disabled={locationLoading}
          className="absolute right-4 z-[1000] bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg p-3.5 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation disabled:opacity-50"
          style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
          aria-label="내 위치"
        >
          {locationLoading ? (
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={locationError ? '#ef4444' : userLocation ? '#60a5fa' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
            </svg>
          )}
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
            <div className="p-4 border-b border-[#21262D]" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}>
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
                <button
                  onClick={() => setHideYeoyu(v => !v)}
                  className="px-2 py-1 rounded-full text-[10px] font-bold transition-all"
                  style={{
                    color: hideYeoyu ? '#0D1117' : '#6b7280',
                    backgroundColor: hideYeoyu ? '#6b7280' : 'transparent',
                    border: `1px solid ${hideYeoyu ? '#6b7280' : '#21262D'}`,
                  }}
                >
                  {hideYeoyu ? '여유 표시' : '여유 숨김'}
                </button>
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
                <>
                  {/* 즐겨찾기 섹션 */}
                  {favoriteAreas.length > 0 && (
                    <>
                      <p className="text-[10px] text-yellow-500 font-semibold px-1 pt-1">★ 즐겨찾기</p>
                      {favoriteAreas.map((area) => (
                        <AreaCard key={area.name} area={area} isFavorite={true} onToggle={toggleFavorite} onSelect={handleAreaSelect} />
                      ))}
                      {normalAreas.length > 0 && <div className="border-t border-[#21262D] pt-1"><p className="text-[10px] text-gray-600 font-semibold px-1">전체</p></div>}
                    </>
                  )}
                  {normalAreas.map((area, idx) => (
                    <AreaCard key={area.name} area={area} idx={idx} isFavorite={false} onToggle={toggleFavorite} onSelect={handleAreaSelect} />
                  ))}
                </>
              )}
            </div>
            <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
          </div>
        </>
      )}
    </div>
  );
}
