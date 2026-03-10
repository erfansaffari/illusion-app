export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { resetResponses } from '../../../lib/store';

export async function POST() {
  try {
    await resetResponses();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[reset] error:', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
