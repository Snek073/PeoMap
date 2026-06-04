import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import type { AreaData } from '../citydata/route';

export const runtime = 'nodejs';

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const LEVEL_ORDER: Record<string, number> = { 붐빔: 4, 약간붐빔: 3, 보통: 2, 여유: 1 };

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 혼잡도 데이터 수집
  const host = process.env.VERCEL_URL ?? 'localhost:3000';
  const proto = process.env.VERCEL_URL ? 'https' : 'http';
  let areas: AreaData[] = [];
  try {
    const res = await fetch(`${proto}://${host}/api/citydata`);
    areas = await res.json();
  } catch {
    return NextResponse.json({ error: 'citydata fetch failed' }, { status: 500 });
  }

  // 알림 메시지 구성
  const sorted = [...areas].sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]);
  const boomCount = areas.filter((a) => a.level === '붐빔').length;
  const slightCount = areas.filter((a) => a.level === '약간붐빔').length;
  const top3 = sorted.slice(0, 3).map((a) => a.name).join(', ');

  const payload = JSON.stringify({
    title: '🗺 오전 8시 서울 혼잡도',
    body: `붐빔 ${boomCount}곳 · 약간붐빔 ${slightCount}곳\n최다혼잡: ${top3}`,
  });

  // 구독자 목록 조회
  const { data: subs } = await getSupabase().from('push_subscriptions').select('*');
  if (!subs?.length) return NextResponse.json({ sent: 0 });

  // 발송 (실패한 구독은 삭제)
  const results = await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      )
    )
  );

  const expired: string[] = [];
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const err = r.reason as { statusCode?: number };
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        expired.push(subs[i].endpoint);
      }
    }
  });

  if (expired.length) {
    await getSupabase().from('push_subscriptions').delete().in('endpoint', expired);
  }

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  return NextResponse.json({ sent, expired: expired.length });
}
