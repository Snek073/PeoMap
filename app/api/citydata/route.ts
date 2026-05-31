import { NextResponse } from 'next/server';

export type CongestLevel = '여유' | '보통' | '약간붐빔' | '붐빔';

export interface ForecastItem {
  time: string;
  level: CongestLevel;
}

export interface AreaData {
  name: string;
  level: CongestLevel;
  min: number;
  max: number;
  lat: number;
  lng: number;
  updatedAt: string;
  forecast: ForecastItem[];
}

// POI 코드 → [lat, lng]
const COORDS: Record<string, [number, number]> = {
  // 관광특구 (7)
  'POI001': [37.5125, 127.0593],  // 강남 MICE 관광특구
  'POI002': [37.5666, 127.0096],  // 동대문 관광특구
  'POI003': [37.5636, 126.9831],  // 명동 관광특구
  'POI004': [37.5347, 126.9941],  // 이태원 관광특구
  'POI005': [37.5133, 127.0970],  // 잠실 관광특구
  'POI006': [37.5700, 126.9847],  // 종로·청계 관광특구
  'POI007': [37.5567, 126.9245],  // 홍대 관광특구
  // 고궁·문화유산 (3)
  'POI008': [37.5796, 126.9770],  // 경복궁
  'POI009': [37.5760, 126.9768],  // 광화문·덕수궁
  'POI012': [37.5794, 126.9944],  // 창덕궁·종묘
  // 주요 지하철 상권 (23)
  'POI013': [37.4815, 126.8825],  // 가산디지털단지역
  'POI014': [37.4979, 127.0276],  // 강남역
  'POI015': [37.5403, 127.0699],  // 건대입구역
  'POI017': [37.5048, 127.0046],  // 고속터미널역
  'POI018': [37.4938, 127.0144],  // 교대역
  'POI019': [37.4853, 126.9013],  // 구로디지털단지역
  'POI029': [37.4765, 126.9816],  // 사당역
  'POI031': [37.4813, 126.9527],  // 서울대입구역
  'POI032': [37.5608, 126.8345],  // 서울식물원·마곡나루역
  'POI033': [37.5558, 126.9723],  // 서울역
  'POI034': [37.5049, 127.0491],  // 선릉역
  'POI036': [37.6384, 127.0255],  // 수유역
  'POI037': [37.5050, 127.0210],  // 신논현역·논현역
  'POI038': [37.5085, 126.8911],  // 신도림역
  'POI039': [37.4843, 126.9293],  // 신림역
  'POI040': [37.5557, 126.9368],  // 신촌·이대역
  'POI041': [37.4840, 127.0343],  // 양재역
  'POI042': [37.5004, 127.0365],  // 역삼역
  'POI043': [37.6193, 126.9200],  // 연신내역
  'POI045': [37.5617, 127.0373],  // 왕십리역
  'POI046': [37.5298, 126.9645],  // 용산역
  'POI049': [37.5580, 127.0672],  // 장한평역
  'POI050': [37.5386, 127.1237],  // 천호역
  'POI053': [37.5499, 126.9151],  // 합정역
  'POI054': [37.5823, 127.0018],  // 혜화역
  // 발달상권·거리 (15)
  'POI059': [37.5214, 127.0224],  // 가로수길
  'POI060': [37.5693, 127.0084],  // 광장(전통)시장
  'POI061': [37.5582, 126.7906],  // 김포공항
  'POI066': [37.5820, 126.9829],  // 북촌한옥마을
  'POI067': [37.5812, 126.9706],  // 서촌
  'POI068': [37.5447, 127.0558],  // 성수카페거리
  'POI071': [37.5269, 127.0391],  // 압구정로데오거리
  'POI072': [37.5214, 126.9246],  // 여의도
  'POI073': [37.5612, 126.9236],  // 연남동
  'POI074': [37.5158, 126.9072],  // 영등포 타임스퀘어
  'POI078': [37.5742, 126.9860],  // 인사동
  'POI080': [37.5242, 127.0438],  // 청담동 명품거리
  'POI082': [37.5393, 126.9891],  // 해방촌·경리단길
  'POI083': [37.5659, 127.0095],  // DDP(동대문디자인플라자)
  'POI115': [37.5596, 126.9769],  // 남대문시장
  'POI116': [37.5746, 126.9976],  // 익선동
  'POI120': [37.5121, 127.1028],  // 잠실롯데타워·석촌호수
  'POI121': [37.5075, 127.1066],  // 송리단길·호수단길
  // 공원·자연 (20)
  'POI085': [37.5639, 126.8525],  // 강서한강공원
  'POI087': [37.5451, 127.1025],  // 광나루한강공원
  'POI089': [37.5235, 126.9801],  // 국립중앙박물관·용산가족공원
  'POI090': [37.5700, 126.8974],  // 난지한강공원
  'POI091': [37.5512, 126.9882],  // 남산공원
  'POI093': [37.5270, 127.0697],  // 뚝섬한강공원
  'POI094': [37.5556, 126.9040],  // 망원한강공원
  'POI095': [37.5082, 127.0055],  // 반포한강공원
  'POI096': [37.6199, 127.0514],  // 북서울꿈의숲
  'POI101': [37.5447, 127.0374],  // 서울숲공원
  'POI102': [37.5578, 127.0996],  // 아차산
  'POI103': [37.5395, 126.8977],  // 양화한강공원
  'POI104': [37.5483, 127.0793],  // 어린이대공원
  'POI105': [37.5284, 126.9325],  // 여의도한강공원
  'POI106': [37.5695, 126.8977],  // 월드컵공원
  'POI108': [37.5168, 126.9717],  // 이촌한강공원
  'POI110': [37.5119, 127.0785],  // 잠실한강공원
  'POI111': [37.5126, 127.0035],  // 잠원한강공원
  'POI112': [37.4297, 127.0561],  // 청계산
  'POI123': [37.4936, 126.9224],  // 보라매공원
  'POI124': [37.5731, 126.9594],  // 서대문독립공원
  'POI127': [37.5204, 127.1225],  // 올림픽공원
};

async function fetchArea(key: string, code: string, lat: number, lng: number): Promise<AreaData | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(
      `http://openapi.seoul.go.kr:8088/${key}/json/citydata_ppltn/1/1/${code}`,
      { cache: 'no-store', signal: controller.signal }
    );
    const json = await res.json();
    const row = json['SeoulRtd.citydata_ppltn']?.[0];
    if (!row) return null;
    const forecast: ForecastItem[] = ((row.FCST_PPLTN as unknown[]) ?? [])
      .slice(0, 6)
      .map((f) => {
        const item = f as Record<string, string>;
        return {
          time: item.FCST_TIME,
          level: item.FCST_CONGEST_LVL.replace(/\s+/g, '') as CongestLevel,
        };
      });
    return {
      name: row.AREA_NM,
      level: (row.AREA_CONGEST_LVL as string).replace(/\s+/g, '') as CongestLevel,
      min: Number(row.AREA_PPLTN_MIN) || 0,
      max: Number(row.AREA_PPLTN_MAX) || 0,
      lat,
      lng,
      updatedAt: row.PPLTN_TIME,
      forecast,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const key = process.env.SEOUL_PPLTN_KEY ?? process.env.SEOUL_API_KEY;
  if (!key) return NextResponse.json([], { status: 500 });

  const results = await Promise.allSettled(
    Object.entries(COORDS).map(([code, [lat, lng]]) => fetchArea(key, code, lat, lng))
  );

  const data = results
    .filter((r): r is PromiseFulfilledResult<AreaData | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((v): v is AreaData => v !== null);

  return NextResponse.json(data);
}
