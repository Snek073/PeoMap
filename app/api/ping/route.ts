import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function round(v: number, d = 3) {
  return Math.round(v * 10 ** d) / 10 ** d;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '';

  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return NextResponse.json({ ok: false, reason: 'local' });
  }

  const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,lat,lon`);
  const geo = await res.json();

  if (geo.status !== 'success' || geo.countryCode !== 'KR') {
    return NextResponse.json({ ok: false, reason: 'not_kr' });
  }

  const lat = round(geo.lat);
  const lng = round(geo.lon);

  await supabase.from('location_pings').insert({ lat, lng });

  return NextResponse.json({ ok: true, lat, lng });
}
