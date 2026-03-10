import { NextResponse } from 'next/server';
import { getResponses } from '../../../lib/store';

export async function GET() {
  const responses = await getResponses();

  const f1 = responses.filter(r => r.form === 1);
  const f2 = responses.filter(r => r.form === 2);

  const yesRate = arr => arr.length === 0 ? null : Math.round(arr.filter(r => r.answer === 'yes').length / arr.length * 100);
  const avgFree = arr => arr.length === 0 ? null : Math.round(arr.reduce((s,r) => s + (r.freedom||0), 0) / arr.length * 10) / 10;
  const avgTime = arr => arr.length === 0 ? null : Math.round(arr.reduce((s,r) => s + (r.elapsed||0), 0) / arr.length / 100) / 10;

  return NextResponse.json({
    total: responses.length,
    form1: { n: f1.length, yesRate: yesRate(f1), avgFreedom: avgFree(f1), avgTime: avgTime(f1) },
    form2: { n: f2.length, yesRate: yesRate(f2), avgFreedom: avgFree(f2), avgTime: avgTime(f2) },
  });
}
