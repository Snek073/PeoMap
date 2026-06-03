import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'PeoMap - 서울 실시간 혼잡도',
  description: '서울 강남, 홍대, 명동, 잠실 등 120개 주요 지역의 실시간 인구 혼잡도를 지도로 확인하세요. 서울특별시 공공데이터 기반 실시간 업데이트.',
  keywords: '서울 혼잡도, 서울 실시간 인구, 강남 혼잡도, 홍대 혼잡도, 명동 혼잡도, 서울 지도, 실시간 붐빔',
  openGraph: {
    title: 'PeoMap - 서울 실시간 혼잡도',
    description: '서울 120개 지역 실시간 혼잡도를 지도로 확인하세요',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3901595520745097" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D1117" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PeoMap" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-[#0D1117]">{children}</body>
    </html>
  );
}
