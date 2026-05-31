import { NextResponse } from 'next/server';

export type CongestLevel = '여유' | '보통' | '약간붐빔' | '붐빔';

export interface AreaData {
  name: string;
  level: CongestLevel;
  min: number;
  max: number;
  lat: number;
  lng: number;
  updatedAt: string;
}

const COORDS: Record<string, [number, number]> = {
  // 강남/서초/송파/강동
  '강남역': [37.4979, 127.0276],
  '강남 COEX': [37.5124, 127.0593],
  '압구정로데오': [37.5269, 127.0391],
  '잠실': [37.5133, 127.1000],
  '잠실한강공원': [37.5119, 127.0785],
  '석촌호수': [37.5075, 127.1009],
  '천호·강동': [37.5385, 127.1240],
  '강동역': [37.5356, 127.1313],
  '고속터미널': [37.5048, 127.0046],
  '반포한강공원': [37.5082, 127.0055],
  '사당역': [37.4765, 126.9816],
  '양재역': [37.4840, 127.0343],
  // 성동/광진/중랑
  '건대입구역': [37.5403, 127.0699],
  '성수카페거리': [37.5447, 127.0558],
  '서울숲': [37.5447, 127.0374],
  '왕십리역': [37.5617, 127.0373],
  '뚝섬한강공원': [37.5270, 127.0697],
  '장한평역': [37.5580, 127.0672],
  '청량리역': [37.5802, 127.0459],
  '상봉역': [37.5980, 127.0828],
  // 마포/서대문/은평
  '홍대입구역': [37.5571, 126.9245],
  '신촌·연세대': [37.5596, 126.9388],
  '합정역': [37.5499, 126.9151],
  '망원한강공원': [37.5556, 126.9040],
  '마포나루·하늘공원': [37.5671, 126.9399],
  '상암 DMC': [37.5683, 126.8974],
  '연남동': [37.5612, 126.9236],
  '서대문역': [37.5579, 126.9539],
  '이화여대': [37.5620, 126.9483],
  '연신내역': [37.6193, 126.9200],
  '불광천': [37.6163, 126.9235],
  // 종로/중구
  '광화문·덕수궁': [37.5760, 126.9768],
  '종로·청계': [37.5702, 126.9876],
  '명동·남대문·북창': [37.5635, 126.9842],
  '인사동·낙원': [37.5742, 126.9860],
  '북촌한옥마을': [37.5820, 126.9829],
  '경복궁·서촌마을': [37.5795, 126.9741],
  '창덕궁·종묘': [37.5794, 126.9944],
  '낙산공원·이화마을': [37.5797, 127.0048],
  '대학로': [37.5828, 127.0020],
  '동묘앞': [37.5718, 127.0156],
  '동대문 DDP': [37.5659, 127.0095],
  // 용산/영등포/구로/금천
  '이태원·한남': [37.5345, 126.9944],
  '용산역': [37.5298, 126.9645],
  '국립중앙박물관·용산가족공원': [37.5235, 126.9801],
  '여의도': [37.5214, 126.9246],
  '여의도한강공원': [37.5284, 126.9325],
  '영등포·타임스퀘어': [37.5158, 126.9072],
  '신도림역': [37.5085, 126.8911],
  '가산디지털단지역': [37.4815, 126.8825],
  '구로디지털단지역': [37.4853, 126.9013],
  // 서울역
  '서울역': [37.5558, 126.9723],
  // 노원/도봉/강북
  '노원역': [37.6560, 127.0564],
  '수유역': [37.6384, 127.0255],
  '창동역': [37.6528, 127.0473],
  '도봉산': [37.6909, 127.0479],
  '고려대역': [37.5891, 127.0277],
  // 관악/동작
  '신림역': [37.4843, 126.9293],
  '서울대입구역': [37.4813, 126.9527],
};

async function fetchArea(key: string, name: string, lat: number, lng: number): Promise<AreaData | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(
      `http://openapi.seoul.go.kr:8088/${key}/json/citydata_ppltn/1/1/${encodeURIComponent(name)}`,
      { cache: 'no-store', signal: controller.signal }
    );
    const json = await res.json();
    const row = json['SeoulRtd.citydata_ppltn']?.[0];
    if (!row) return null;
    return {
      name: row.AREA_NM,
      level: (row.AREA_CONGEST_LVL as string).replace(/\s+/g, '') as CongestLevel,
      min: Number(row.AREA_PPLTN_MIN) || 0,
      max: Number(row.AREA_PPLTN_MAX) || 0,
      lat,
      lng,
      updatedAt: row.PPLTN_TIME,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(req: Request) {
  const key = process.env.SEOUL_API_KEY;
  if (!key) return NextResponse.json([], { status: 500 });

  const { searchParams } = new URL(req.url);
  const ppltnKey = process.env.SEOUL_PPLTN_KEY;

  // ?test=3 — POI 코드(POI001~POI130)로 조회해서 전체 지역명 확인
  if (searchParams.get('test') === '3') {
    const testKey = ppltnKey ?? key;
    const codes = Array.from({ length: 130 }, (_, i) => `POI${String(i + 1).padStart(3, '0')}`);
    const results = await Promise.allSettled(
      codes.map(async (code) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        try {
          const res = await fetch(
            `http://openapi.seoul.go.kr:8088/${testKey}/json/citydata_ppltn/1/1/${code}`,
            { cache: 'no-store', signal: controller.signal }
          );
          const json = await res.json();
          const row = json['SeoulRtd.citydata_ppltn']?.[0];
          return row ? { code, name: row.AREA_NM, level: (row.AREA_CONGEST_LVL as string).replace(/\s+/g, '') } : null;
        } finally { clearTimeout(timer); }
      })
    );
    const areas = results
      .filter((r): r is PromiseFulfilledResult<{ code: string; name: string; level: string } | null> => r.status === 'fulfilled')
      .map(r => r.value)
      .filter((v): v is { code: string; name: string; level: string } => v !== null);
    return NextResponse.json({ count: areas.length, areas });
  }

  const results = await Promise.allSettled(
    Object.entries(COORDS).map(async ([name, [lat, lng]]) => {
      // 기본 키로 먼저 시도, 실패하면 OA-21778 키로 재시도
      const primary = await fetchArea(key, name, lat, lng);
      if (primary) return primary;
      if (ppltnKey && ppltnKey !== key) {
        return fetchArea(ppltnKey, name, lat, lng);
      }
      return null;
    })
  );

  const data = results
    .filter((r): r is PromiseFulfilledResult<AreaData | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((v): v is AreaData => v !== null);

  return NextResponse.json(data);
}
