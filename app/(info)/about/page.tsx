import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PeoMap 소개 — 서울 실시간 혼잡도',
  description:
    'PeoMap은 이태원 참사, 성수동 팝업스토어 군중 사고 등을 계기로 만든 서울 실시간 인구 혼잡도 서비스입니다. 서울시 공공데이터를 활용해 120개 지역 혼잡도를 5분마다 제공합니다.',
};

const FEATURES = [
  { icon: '🗺️', title: '직관적인 지도', desc: '서울 전체 혼잡도를 한눈에 확인. 색상 하나로 붐빔·여유를 즉시 파악할 수 있습니다.' },
  { icon: '⚡', title: '5분마다 갱신', desc: '서울시 공공데이터를 5분 주기로 수집해 가장 최신 혼잡 정보를 제공합니다.' },
  { icon: '🔔', title: '혼잡도 알림', desc: '매일 아침 8시, 설정한 지역의 혼잡 예보를 푸시 알림으로 받을 수 있습니다.' },
  { icon: '📍', title: '내 위치 연동', desc: '현재 위치 주변 혼잡도를 바로 확인하고 덜 붐비는 장소를 선택하세요.' },
  { icon: '⭐', title: '즐겨찾기', desc: '자주 방문하는 지역을 즐겨찾기로 고정해 빠르게 확인할 수 있습니다.' },
  { icon: '📊', title: '혼잡 예측 경고', desc: '지금은 여유롭지만 곧 혼잡이 예상되는 지역을 미리 알려줍니다.' },
];

export default function AboutPage() {
  return (
    <div className="space-y-14">

      {/* 히어로 */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-orange-400 text-sm font-medium">서비스 소개</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          사람이 몰리는 곳,<br />미리 알고 대비하세요
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
          PeoMap은 서울 시내 120개 이상 주요 지역의 실시간 인구 혼잡도를 지도 위에 시각화합니다.
          5분마다 갱신되는 데이터로 방문 전 혼잡도를 확인하고 안전한 동선을 선택할 수 있습니다.
        </p>
      </section>

      {/* 탄생 배경 */}
      <section className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-orange-400 text-lg">📌</span>
          <h2 className="text-xl font-bold text-white">왜 이 서비스를 만들었나요?</h2>
        </div>

        <div className="space-y-5 text-gray-300 leading-relaxed text-base">
          <p>
            2022년 10월 29일, <strong className="text-white">이태원 참사</strong>로 159명이 목숨을 잃었습니다.
            핼러윈 시즌 서울 이태원의 좁은 골목에 수만 명이 한꺼번에 몰려들었지만,
            그 위험을 사전에 파악하거나 대피 경로를 선택할 수 있는 정보가 시민들에게 없었습니다.
          </p>
          <p>
            그 이후에도 서울 곳곳에서 비슷한 위험이 반복되고 있습니다.
            성수동 팝업스토어 주변, 홍대 거리, 강남 행사장 등에서는 특정 시간대에 수천 명이 밀집해
            <strong className="text-white"> 압사·부상 위험</strong>이 매번 재연됩니다.
            지하철역 출구, 좁은 골목, 광장 앞 — 사람이 몰리는 장소와 시간대는 어느 정도 예측할 수 있음에도
            그 정보가 시민에게 제대로 전달되지 않고 있습니다.
          </p>
          <p>
            서울시는 이미 <strong className="text-white">실시간 도시데이터 API</strong>를 통해
            주요 지역의 혼잡도 정보를 공개하고 있습니다.
            PeoMap은 이 공공데이터를 누구나 직관적으로 이해할 수 있는 지도 형태로 가공해 제공합니다.
            별도 앱 설치 없이 웹 브라우저 하나로, 지금 이 순간 서울 어느 곳이 얼마나 붐비는지 바로 확인할 수 있습니다.
          </p>
          <p className="text-orange-300 font-medium border-l-2 border-orange-500 pl-4">
            "다음 이태원은 없어야 합니다. 미리 알면 피할 수 있습니다."
          </p>
        </div>
      </section>

      {/* 주요 특징 */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-white">주요 특징</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map(item => (
            <div key={item.title} className="bg-[#161B22] border border-[#21262D] rounded-xl p-5 space-y-2 hover:border-[#30363D] transition-colors">
              <div className="text-2xl">{item.icon}</div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 서비스 현황 */}
      <section className="grid sm:grid-cols-3 gap-4 text-center">
        {[
          { value: '120+', label: '모니터링 지역' },
          { value: '5분', label: '데이터 갱신 주기' },
          { value: '24시간', label: '연중무휴 운영' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#161B22] border border-[#21262D] rounded-xl p-5">
            <p className="text-3xl font-bold text-orange-400">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* 데이터 출처 */}
      <section className="bg-[#161B22] border border-[#21262D] rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-bold text-white">데이터 출처</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          PeoMap은 <strong className="text-gray-200">서울특별시 실시간 도시데이터(Seoul TOPIS)</strong>의 공공 API를 활용합니다.
          서울시 공공데이터는 누구나 열람할 수 있으며, 혼잡도 수치는 통신사 이동 데이터·교통 데이터 등을 서울시가
          종합 산출한 값입니다. 실제 현장 상황과 다소 차이가 있을 수 있으므로 참고 자료로 활용해 주세요.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          지금 실시간 혼잡도 확인하기
        </Link>
        <p className="text-gray-600 text-xs">
          <Link href="/guide" className="underline hover:text-gray-400 transition-colors">이용 방법 자세히 보기</Link>
          {' · '}
          <Link href="/contact" className="underline hover:text-gray-400 transition-colors">의견 / 피드백 보내기</Link>
        </p>
      </section>

    </div>
  );
}
