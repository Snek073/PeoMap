'use client';

export default function ContactButton() {
  const handleClick = () => {
    const parts = ['kangin.we', 'gmail.com'];
    window.location.href = `mailto:${parts[0]}@${parts[1]}?subject=[PeoMap 문의]`;
  };
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      문의하기
    </button>
  );
}
