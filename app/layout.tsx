import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '실시간 인구 지도',
  description: '한국 실시간 인구 현황을 지도로 확인하세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full bg-[#0D1117]">{children}</body>
    </html>
  );
}
