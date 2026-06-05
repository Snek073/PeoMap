import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보 처리 방침 — PeoMap',
  description: 'PeoMap 개인정보 처리 방침. 수집 항목, 이용 목적, 보유 기간, 이용자 권리를 안내합니다.',
};

export default function PrivacyPage() {
  return (
    <div className="space-y-10">

      {/* 제목 */}
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-white">개인정보 처리 방침</h1>
        <p className="text-gray-500 text-sm">시행일: 2025년 1월 1일 &nbsp;|&nbsp; 최종 개정: 2026년 6월 5일</p>
        <p className="text-gray-400 leading-relaxed">
          PeoMap(이하 '서비스')은 이용자의 개인정보를 소중히 여기며,
          「개인정보 보호법」 등 관련 법령을 준수합니다.
          본 방침은 서비스가 수집하는 정보, 이용 목적, 보유 기간, 이용자 권리를 안내합니다.
        </p>
      </section>

      {/* 섹션 공통 컴포넌트 */}
      {[
        {
          num: '1',
          title: '수집하는 정보',
          content: (
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <div>
                <p className="text-gray-200 font-semibold mb-1">① 위치 정보 (선택)</p>
                <p>
                  '내 위치' 버튼을 누를 때 브라우저의 Geolocation API를 통해 현재 위치(위도·경도)를 수집합니다.
                  위치 정보는 기기 내에서만 처리되며 서버로 전송·저장되지 않습니다.
                  위치 정보 제공은 선택 사항으로, 거부해도 지도 조회 등 핵심 서비스를 이용할 수 있습니다.
                </p>
              </div>
              <div>
                <p className="text-gray-200 font-semibold mb-1">② 푸시 알림 구독 정보 (선택)</p>
                <p>
                  알림을 동의한 경우 브라우저 Web Push 구독 정보(엔드포인트 URL, 암호화 키)를 서버에 저장합니다.
                  이 정보는 알림 발송에만 사용되며, 개인을 식별하는 정보를 포함하지 않습니다.
                </p>
              </div>
              <div>
                <p className="text-gray-200 font-semibold mb-1">③ 즐겨찾기 (로컬 저장)</p>
                <p>
                  즐겨찾기 목록은 이용자의 기기 브라우저 로컬 저장소(localStorage)에만 저장되며,
                  서버로 전송되지 않습니다.
                </p>
              </div>
              <div>
                <p className="text-gray-200 font-semibold mb-1">④ 광고 쿠키 (Google AdSense)</p>
                <p>
                  서비스는 Google AdSense를 통한 광고를 게재할 수 있습니다.
                  Google은 광고 서비스 제공을 위해 쿠키를 사용하며, 이를 통해 이전 방문 정보에 기반한
                  맞춤형 광고가 표시될 수 있습니다.
                  Google의 광고 쿠키 사용 방식은{' '}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 underline hover:text-orange-300"
                  >
                    Google 개인정보 보호 정책
                  </a>에서 확인할 수 있습니다.
                  브라우저 설정 또는{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 underline hover:text-orange-300"
                  >
                    Google 광고 설정
                  </a>에서 맞춤형 광고를 비활성화할 수 있습니다.
                </p>
              </div>
            </div>
          ),
        },
        {
          num: '2',
          title: '정보 수집 및 이용 목적',
          content: (
            <table className="w-full text-sm text-gray-400 border-collapse">
              <thead>
                <tr className="border-b border-[#21262D] text-gray-300">
                  <th className="text-left py-2 pr-4 font-semibold w-1/3">항목</th>
                  <th className="text-left py-2 font-semibold">이용 목적</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262D]">
                {[
                  ['위치 정보', '지도에서 현재 위치 표시'],
                  ['푸시 구독 정보', '혼잡도 알림 발송'],
                  ['즐겨찾기 (로컬)', '자주 가는 지역 빠른 확인'],
                  ['광고 쿠키', '서비스 유지를 위한 광고 게재'],
                ].map(([item, purpose]) => (
                  <tr key={item}>
                    <td className="py-2.5 pr-4 text-gray-300">{item}</td>
                    <td className="py-2.5">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ),
        },
        {
          num: '3',
          title: '정보 보유 및 파기',
          content: (
            <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
              <p>
                <strong className="text-gray-200">푸시 알림 구독 정보:</strong> 이용자가 알림을 해제하거나
                구독 취소를 요청한 즉시 서버에서 삭제됩니다.
              </p>
              <p>
                <strong className="text-gray-200">위치 정보:</strong> 서버에 저장되지 않으므로 별도 파기 절차가 없습니다.
              </p>
              <p>
                <strong className="text-gray-200">즐겨찾기:</strong> 브라우저 로컬 저장소에 보관되며,
                이용자가 직접 브라우저 데이터를 삭제하거나 앱을 삭제하면 제거됩니다.
              </p>
            </div>
          ),
        },
        {
          num: '4',
          title: '제3자 제공 및 위탁',
          content: (
            <p className="text-gray-400 text-sm leading-relaxed">
              서비스는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
              단, Google AdSense 광고 서비스 이용 시 Google의 개인정보 처리 방침이 적용됩니다.
              법령에 의거한 경우, 또는 이용자가 사전 동의한 경우에 한해 제공될 수 있습니다.
            </p>
          ),
        },
        {
          num: '5',
          title: '이용자 권리',
          content: (
            <div className="space-y-2 text-gray-400 text-sm leading-relaxed">
              <p>이용자는 다음 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>개인정보 열람 요청</li>
                <li>개인정보 삭제 요청 (푸시 구독 정보 제거)</li>
                <li>알림 구독 취소 (앱 내 알림 버튼 또는 브라우저 설정)</li>
                <li>위치 정보 제공 거부 (브라우저 권한 설정)</li>
              </ul>
              <p className="pt-2">
                권리 행사 요청은 아래 문의처로 연락 주시면 지체 없이 처리하겠습니다.
              </p>
            </div>
          ),
        },
        {
          num: '6',
          title: '개인정보 보호 책임자',
          content: (
            <div className="text-gray-400 text-sm space-y-1">
              <p><strong className="text-gray-200">서비스명:</strong> PeoMap</p>
              <p>
                <strong className="text-gray-200">문의:</strong>{' '}
                <a href="/contact" className="text-orange-400 underline hover:text-orange-300">
                  문의 페이지 바로가기
                </a>
              </p>
              <p className="pt-2 text-gray-500">
                개인정보 관련 불만이나 피해 구제는{' '}
                <a
                  href="https://www.privacy.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 underline hover:text-orange-300"
                >
                  개인정보보호위원회
                </a>에 신고하실 수 있습니다.
              </p>
            </div>
          ),
        },
      ].map(section => (
        <section key={section.num} className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-orange-500/10 text-orange-400 text-sm font-bold flex items-center justify-center shrink-0">
              {section.num}
            </span>
            {section.title}
          </h2>
          <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-5">
            {section.content}
          </div>
        </section>
      ))}

      <section className="border-t border-[#21262D] pt-6 text-center">
        <Link href="/contact" className="text-sm text-gray-400 underline hover:text-white transition-colors">
          개인정보 관련 문의하기 →
        </Link>
      </section>

    </div>
  );
}
