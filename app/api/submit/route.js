import { NextResponse } from 'next/server';
import { addResponse } from '../../../lib/store';

export async function POST(req) {
  const body = await req.json();
  await addResponse(body);
  return NextResponse.json({ ok: true });
}
