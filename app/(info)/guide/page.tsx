import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용 안내 — PeoMap 서울 실시간 혼잡도',
  description:
    'PeoMap 사용 방법, 혼잡도 색상 기준, 알림 설정, 즐겨찾기, 자주 묻는 질문(FAQ), 활용 팁을 확인하세요.',
};

const LEVELS = [
  { color: '#ef4444', bg: '#ef444422', label: '붐빔', desc: '매우 혼잡. 이동이 불편하고 안전 위험이 있을 수 있습니다. 방문을 재고하거나 시간대를 바꾸는 것을 권장합니다.' },
  { color: '#f97316', bg: '#f9731622', label: '약간붐빔', desc: '다소 혼잡. 사람 간 간격이 좁아지기 시작합니다. 여유 있는 이동은 어렵습니다.' },
  { color: '#eab308', bg: '#eab30822', label: '보통', desc: '무난한 혼잡도. 사람이 있지만 이동에 큰 불편은 없습니다.' },
  { color: '#22c55e', bg: '#22c55e22', label: '여유', desc: '쾌적한 상태. 이동이 편하고 인파로 인한 불편이 없습니다.' },
];

const STEPS = [
  {
    step: '01',
    title: '지도에서 색상 확인',
    desc: '메인 화면의 지도를 열면 서울 주요 지역에 색상 원형 마커가 표시됩니다. 빨간색에 가까울수록 붐비는 지역입니다. 마커를 클릭하면 해당 지역 이름과 추정 인원수를 확인할 수 있습니다.',
  },
  {
    step: '02',
    title: '사이드바로 상세 목록 확인',
    desc: '화면 오른쪽 상단의 📊 버튼을 누르면 지역 목록 사이드바가 열립니다. 혼잡한 순서로 정렬된 목록에서 지역을 검색하거나 혼잡도 필터로 원하는 수준만 볼 수 있습니다.',
  },
  {
    step: '03',
    title: '즐겨찾기 추가',
    desc: '자주 방문하는 지역 옆 ☆ 버튼을 눌러 즐겨찾기에 추가하세요. 즐겨찾기한 지역은 목록 맨 위에 고정되어 빠르게 확인할 수 있습니다. 즐겨찾기 정보는 기기에 저장됩니다.',
  },
  {
    step: '04',
    title: '푸시 알림 설정',
    desc: '화면 오른쪽의 🔔 버튼으로 알림을 설정할 수 있습니다. 알림을 허용하면 매일 오전 8시에 혼잡도 현황을 알림으로 받을 수 있습니다.',
  },
  {
    step: '05',
    title: '내 위치로 주변 확인',
    desc: '화면 오른쪽 하단의 위치 아이콘(⊕)을 누르면 지도가 내 현재 위치로 이동합니다. 주변에 혼잡한 지역이 있는지 쉽게 파악할 수 있습니다.',
  },
];

const FAQS = [
  {
    q: '데이터가 실시간인가요?',
    a: '네, 서울시 공공데이터를 5분마다 새로 가져옵니다. 지도 상단 배지에서 마지막 갱신 시점을 확인할 수 있으며, 새로고침 버튼으로 즉시 갱신할 수도 있습니다.',
  },
  {
    q: '알림은 언제, 어떤 내용으로 오나요?',
    a: '알림을 설정하면 매일 오전 8시에 서울 주요 지역의 혼잡도 현황 알림을 받습니다. 알림 내용에는 특히 혼잡한 지역 정보가 포함됩니다.',
  },
  {
    q: '어떤 데이터를 기반으로 하나요?',
    a: '서울특별시 실시간 도시데이터(Seoul TOPIS) API를 활용합니다. 서울시가 통신사 이동 데이터, 교통 데이터 등을 종합해 산출한 공공 혼잡도 지표입니다.',
  },
  {
    q: '서울 이외 지역도 보이나요?',
    a: '현재는 서울시가 공식 제공하는 120개 이상의 서울 주요 지역만 지원합니다. 향후 서비스 확대를 검토 중입니다.',
  },
  {
    q: '즐겨찾기가 초기화됐어요.',
    a: '즐겨찾기는 사용 중인 브라우저의 로컬 저장소에 저장됩니다. 브라우저 데이터를 삭제하거나 다른 기기·브라우저에서 접속하면 즐겨찾기가 유지되지 않습니다.',
  },
  {
    q: '알림이 오지 않아요.',
    a: '브라우저 알림이 "차단"으로 설정되어 있으면 알림을 받을 수 없습니다. 브라우저 설정 또는 운영체제의 알림 권한에서 PeoMap 사이트의 알림을 허용해 주세요.',
  },
  {
    q: '지도가 느리게 로딩돼요.',
    a: '지도 라이브러리 특성상 첫 로딩 시 다소 시간이 걸릴 수 있습니다. 인터넷 연결이 원활한 환경에서 이용해 주세요.',
  },
];

const TIPS = [
  { icon: '🕐', title: '혼잡 피크 시간대', desc: '주말 오후 2~7시는 강남, 홍대, 명동, 성수동 등 번화가의 혼잡도가 가장 높습니다. 이 시간을 피해 방문하거나 사전에 확인하세요.' },
  { icon: '⭐', title: '즐겨찾기 활용', desc: '출퇴근 경로나 자주 가는 지역을 즐겨찾기해 두면 앱을 열 때마다 맨 위에서 빠르게 확인할 수 있습니다.' },
  { icon: '🙈', title: '여유 숨김 기능', desc: '사이드바 필터에서 "여유 숨김"을 켜면 혼잡한 지역만 목록에 표시됩니다. 피해야 할 곳을 한눈에 파악할 때 유용합니다.' },
  { icon: '⚠️', title: '예측 경고 확인', desc: '현재는 여유롭지만 곧 혼잡해질 예정인 지역은 주황 경고 문구가 표시됩니다. 이동 계획 시 꼭 확인하세요.' },
  { icon: '📱', title: '홈 화면에 추가', desc: '브라우저 공유 버튼에서 "홈 화면에 추가"를 선택하면 앱처럼 바로 실행할 수 있습니다. 매번 주소를 입력할 필요가 없습니다.' },
  { icon: '🔄', title: '수동 새로고침', desc: '지도 상단 배지의 새로고침 버튼(↺)을 누르면 5분 주기를 기다리지 않고 즉시 최신 데이터를 불러옵니다.' },
];

export default function GuidePage() {
  return (
    <div className="space-y-14">

      {/* 제목 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-orange-400 text-sm font-medium">이용 안내</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">PeoMap 사용 방법</h1>
        <p className="text-gray-400 leading-relaxed">
          처음 오셨나요? 아래에서 주요 기능과 사용법을 확인하세요.
        </p>
      </section>

      {/* 혼잡도 기준 */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-white">혼잡도 색상 기준</h2>
        <div className="space-y-3">
          {LEVELS.map(lv => (
            <div key={lv.label} className="flex items-start gap-4 bg-[#161B22] border border-[#21262D] rounded-xl p-4">
              <div
                className="w-4 h-4 rounded-full mt-0.5 shrink-0"
                style={{ backgroundColor: lv.color, boxShadow: `0 0 8px ${lv.color}66` }}
              />
              <div>
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded-full"
                  style={{ color: lv.color, backgroundColor: lv.bg }}
                >
                  {lv.label}
                </span>
                <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{lv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-white">기능별 사용 방법</h2>
        <div className="space-y-4">
          {STEPS.map(s => (
            <div key={s.step} className="flex gap-4 bg-[#161B22] border border-[#21262D] rounded-xl p-5">
              <span className="text-orange-500 font-bold text-lg shrink-0 w-8">{s.step}</span>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-white">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 팁 */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-white">활용 팁</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {TIPS.map(tip => (
            <div key={tip.title} className="bg-[#161B22] border border-[#21262D] rounded-xl p-5 space-y-2">
              <div className="text-2xl">{tip.icon}</div>
              <h3 className="font-semibold text-white text-sm">{tip.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-white">자주 묻는 질문 (FAQ)</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-[#161B22] border border-[#21262D] rounded-xl p-5 space-y-2">
              <p className="font-semibold text-white text-sm flex gap-2">
                <span className="text-orange-400 shrink-0">Q.</span>
                {faq.q}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 링크 */}
      <section className="border-t border-[#21262D] pt-8 flex flex-col sm:flex-row gap-4 text-sm">
        <Link href="/" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-center">
          지도 바로 가기
        </Link>
        <Link href="/contact" className="flex-1 border border-[#21262D] hover:border-[#30363D] text-gray-300 hover:text-white font-semibold px-5 py-3 rounded-xl transition-colors text-center">
          문의 / 피드백 보내기
        </Link>
      </section>

    </div>
  );
}
