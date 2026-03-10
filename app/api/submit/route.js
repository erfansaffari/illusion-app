export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { addResponse } from '../../../lib/store';

export async function POST(req) {
  try {
    const body = await req.json();
    await addResponse(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[submit] error:', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
