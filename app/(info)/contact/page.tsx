import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '문의 — PeoMap 서울 실시간 혼잡도',
  description: 'PeoMap 서비스 문의, 버그 신고, 데이터 오류 제보, 기능 제안을 보내주세요.',
};

const TOPICS = [
  { icon: '🐛', title: '버그 신고', desc: '지도가 안 열리거나, 데이터가 이상하거나, 알림이 오지 않는 경우 알려주세요.' },
  { icon: '📊', title: '데이터 오류 제보', desc: '특정 지역의 혼잡도가 실제와 크게 다른 경우 제보해 주세요. 서울시 공공데이터 개선에 활용됩니다.' },
  { icon: '💡', title: '기능 제안', desc: '새로운 기능이나 개선 아이디어가 있으시면 언제든지 보내주세요. 적극 검토합니다.' },
  { icon: '🤝', title: '제휴 / 협력', desc: '서비스 협력, 데이터 활용, 언론 문의 등은 이메일로 연락 주세요.' },
];

export default function ContactPage() {
  return (
    <div className="space-y-12">

      {/* 제목 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-orange-400 text-sm font-medium">문의</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">의견을 들려주세요</h1>
        <p className="text-gray-400 leading-relaxed max-w-xl">
          PeoMap을 더 안전하고 유용한 서비스로 만드는 데 여러분의 피드백이 큰 도움이 됩니다.
          불편한 점, 개선 아이디어, 버그 신고 모두 환영합니다.
        </p>
      </section>

      {/* 이메일 문의 */}
      <section className="bg-[#161B22] border border-orange-500/30 rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white">이메일 문의</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          아래 이메일로 문의 주시면 영업일 기준 1~3일 이내에 답변 드리겠습니다.
        </p>
        <a
          href="mailto:kangin.we@gmail.com"
          className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          kangin.we@gmail.com
        </a>
        <div className="text-xs text-gray-600 space-y-1 pt-1">
          <p>• 스팸 방지를 위해 제목에 [PeoMap 문의] 를 포함해 주시면 빠른 처리가 가능합니다.</p>
          <p>• 버그 신고 시 사용 중인 기기/브라우저 정보와 증상을 함께 보내주시면 도움이 됩니다.</p>
        </div>
      </section>

      {/* 문의 유형 */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-white">어떤 내용이든 좋아요</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {TOPICS.map(topic => (
            <div key={topic.title} className="bg-[#161B22] border border-[#21262D] rounded-xl p-5 space-y-2 hover:border-[#30363D] transition-colors">
              <div className="text-2xl">{topic.icon}</div>
              <h3 className="font-semibold text-white text-sm">{topic.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{topic.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 자주 찾는 링크 */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">문의 전에 확인해 보세요</h2>
        <div className="space-y-2">
          {[
            { href: '/guide', label: '이용 안내 · FAQ 보기', desc: '자주 묻는 질문에서 답을 찾을 수 있을 수 있습니다.' },
            { href: '/about', label: '서비스 소개 보기', desc: 'PeoMap의 데이터 출처와 서비스 목적을 확인하세요.' },
            { href: '/privacy', label: '개인정보 처리 방침', desc: '수집 정보 및 이용자 권리를 확인할 수 있습니다.' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between bg-[#161B22] border border-[#21262D] hover:border-[#30363D] rounded-xl p-4 transition-colors group"
            >
              <div>
                <p className="text-white text-sm font-semibold group-hover:text-orange-400 transition-colors">{link.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{link.desc}</p>
              </div>
              <svg className="text-gray-600 group-hover:text-orange-400 transition-colors shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
