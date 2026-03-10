import { NextResponse } from 'next/server';
import { resetResponses } from '../../../lib/store';

export async function POST() {
  await resetResponses();
  return NextResponse.json({ ok: true });
}
