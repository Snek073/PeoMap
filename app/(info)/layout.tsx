import Link from 'next/link';

const NAV = [
  { href: '/about', label: '사이트 소개' },
  { href: '/guide', label: '이용 안내' },
  { href: '/contact', label: '문의' },
];

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col">
      <header className="sticky top-0 z-10 border-b border-[#21262D] bg-[#161B22]/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-orange-500 group-hover:animate-pulse" />
            <span className="font-bold text-white">PeoMap</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-gray-400">
            {NAV.map(l => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors hidden sm:block">
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            >
              지도 보기
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-12">
        {children}
      </main>

      <footer className="border-t border-[#21262D] bg-[#161B22]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="font-bold text-white text-sm">PeoMap</span>
              </div>
              <p className="text-xs text-gray-500">서울특별시 공공데이터 기반 실시간 혼잡도 서비스</p>
              <p className="text-xs text-gray-600 mt-1">© 2025 PeoMap. All rights reserved.</p>
            </div>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
              <Link href="/about" className="hover:text-gray-300 transition-colors">사이트 소개</Link>
              <Link href="/guide" className="hover:text-gray-300 transition-colors">이용 안내</Link>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">개인정보 처리 방침</Link>
              <Link href="/contact" className="hover:text-gray-300 transition-colors">문의</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
