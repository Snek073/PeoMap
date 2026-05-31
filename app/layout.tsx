import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PeoMap - 서울 실시간 혼잡도',
  description: '서울 120개 지역 실시간 혼잡도를 지도로 확인하세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D1117" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PeoMap" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="h-full bg-[#0D1117]">{children}</body>
    </html>
  );
}
