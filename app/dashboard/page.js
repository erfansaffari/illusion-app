'use client';
import { useState, useEffect, useCallback } from 'react';

const NAVY  = '#0C1931';
const NAVY2 = '#162640';
const AMBER = '#E8A020';
const TEAL  = '#0AAFA0';
const CORAL = '#D94F3D';
const WHITE = '#FFFFFF';

const s = {
  page: { minHeight: '100vh', background: NAVY, color: WHITE, padding: '0 0 40px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  topBar: { background: '#080F1C', padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E3350' },
  topLeft: { fontSize: 11, fontWeight: 700, letterSpacing: 3, color: AMBER },
  topRight: { display: 'flex', gap: 10, alignItems: 'center' },
  liveTag: { background: CORAL, color: WHITE, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: 1.5 },
  totalBadge: { fontSize: 13, color: '#7090AA' },
  body: { padding: '28px 28px 0' },
  headline: { fontSize: 28, fontWeight: 700, marginBottom: 4, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: '#7090AA', marginBottom: 28 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  panel: { background: NAVY2, borderRadius: 12, padding: '20px 22px', border: '1px solid #1E3350' },
  panelTitle: { fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 14 },
  bigNum: { fontSize: 52, fontWeight: 800, lineHeight: 1, marginBottom: 4 },
  panelSub: { fontSize: 12, color: '#7090AA' },
  statRow: { display: 'flex', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, background: NAVY2, borderRadius: 12, padding: '16px 18px', border: '1px solid #1E3350' },
  statVal: { fontSize: 30, fontWeight: 800, lineHeight: 1, marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#7090AA' },
  barWrap: { background: '#1E3350', borderRadius: 8, height: 10, overflow: 'hidden', marginTop: 8 },
  bar: { height: '100%', borderRadius: 8, transition: 'width 0.5s ease' },
  btnRow: { display: 'flex', gap: 10, marginTop: 24 },
  btn: { padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none' },
  btnReset: { background: '#1E3350', color: '#8090A8' },
  btnRefresh: { background: TEAL, color: WHITE },
  diffRow: { background: '#0A1E30', borderRadius: 12, padding: '16px 20px', border: `1px solid ${AMBER}33`, marginBottom: 24 },
  diffLabel: { fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 },
  diffText: { fontSize: 15, lineHeight: 1.6, color: '#C8D8E8' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#3A5070' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
};

function Stat({ val, label, color }) {
  return (
    <div style={s.statCard}>
      <div style={{ ...s.statVal, color: color || WHITE }}>{val ?? '—'}{typeof val === 'number' && label.includes('%') ? '%' : ''}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  );
}

function FormPanel({ data, title, color }) {
  if (!data) return null;
  const { n, yesRate, avgFreedom, avgTime } = data;
  return (
    <div style={{ ...s.panel, borderColor: color + '44' }}>
      <div style={{ ...s.panelTitle, color }}>{title}</div>
      <div style={{ ...s.bigNum, color }}>{yesRate !== null ? yesRate + '%' : n === 0 ? '—' : '—'}</div>
      <div style={s.panelSub}>said YES</div>
      <div style={s.barWrap}>
        <div style={{ ...s.bar, width: (yesRate || 0) + '%', background: color }} />
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: WHITE }}>{avgFreedom !== null ? avgFreedom : '—'}<span style={{ fontSize: 12, color: '#7090AA' }}>/7</span></div>
          <div style={{ fontSize: 11, color: '#7090AA' }}>avg felt-free</div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: WHITE }}>{avgTime !== null ? avgTime + 's' : '—'}</div>
          <div style={{ fontSize: 11, color: '#7090AA' }}>avg time</div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: WHITE }}>{n}</div>
          <div style={{ fontSize: 11, color: '#7090AA' }}>responses</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/results?t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      setData(json);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('fetchData error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 4000);
    return () => clearInterval(id);
  }, [fetchData]);

  function handleResetClick() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    doReset();
  }

  async function doReset() {
    setConfirmReset(false);
    setResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Reset failed');
      await fetchData();
    } catch (e) {
      alert('Reset failed: ' + e.message);
    } finally {
      setResetting(false);
    }
  }

  const hasData = data && (data.form1.n > 0 || data.form2.n > 0);

  function getInsight() {
    if (!data || !hasData) return null;
    const { form1, form2 } = data;
    if (form1.yesRate === null || form2.yesRate === null) return null;
    const diff = form2.yesRate - form1.yesRate;
    const freedomDiff = form1.avgFreedom !== null && form2.avgFreedom !== null ? (form1.avgFreedom - form2.avgFreedom).toFixed(1) : null;
    if (Math.abs(diff) < 5) {
      return `The yes rates came out close (Form A: ${form1.yesRate}%, Form B: ${form2.yesRate}%). Same effect, smaller gap — see Slide 7 for the controlled study that shows 83% shift with identical mechanics.`;
    }
    if (diff > 0) {
      return `Form B (friction on No) produced ${diff} percentage points more yes responses than Form A. Same people, same program, different interface. ${freedomDiff ? `Form A's felt-free score was ${freedomDiff} points higher on average.` : ''}`;
    }
    return `Form A (friction on Yes) produced ${Math.abs(diff)} more no responses. The interface pushed people away even when they might have been open to joining. ${freedomDiff ? `Freedom scores shifted by ${Math.abs(freedomDiff)} points between forms.` : ''}`;
  }

  const insight = getInsight();

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div style={s.topLeft}>THE ILLUSION OF CHOICE  ·  LIVE RESULTS</div>
        <div style={s.topRight}>
          <div style={s.liveTag}>● LIVE</div>
          {lastUpdate && <div style={s.totalBadge}>Updated {lastUpdate}</div>}
          {data && <div style={s.totalBadge}>{data.total} responses total</div>}
        </div>
      </div>

      <div style={s.body}>
        <h1 style={s.headline}>Same question. Different interface.</h1>
        <p style={s.sub}>Results update every 4 seconds. Refresh manually to force update.</p>

        {loading && <div style={s.empty}><div style={s.emptyIcon}>⏳</div><div>Loading...</div></div>}

        {!loading && !hasData && (
          <div style={s.empty}>
            <div style={s.emptyIcon}>📱</div>
            <div style={{ fontSize: 16, marginBottom: 8 }}>Waiting for responses...</div>
            <div style={{ fontSize: 13 }}>Share the /form link or QR code with participants.</div>
          </div>
        )}

        {!loading && hasData && (
          <>
            {insight && (
              <div style={s.diffRow}>
                <div style={s.diffLabel}>KEY FINDING</div>
                <div style={s.diffText}>{insight}</div>
              </div>
            )}

            <div style={s.grid}>
              <FormPanel data={data.form1} title="FORM A  —  FRICTION ON YES" color={CORAL} />
              <FormPanel data={data.form2} title="FORM B  —  FRICTION ON NO" color={TEAL} />
            </div>

            {data.form1.yesRate !== null && data.form2.yesRate !== null && (
              <div style={s.statRow}>
                <div style={{ ...s.statCard, borderTop: `3px solid ${AMBER}` }}>
                  <div style={{ ...s.statVal, color: AMBER }}>
                    {Math.abs(data.form2.yesRate - data.form1.yesRate)}pp
                  </div>
                  <div style={s.statLabel}>Yes rate shift between forms</div>
                </div>
                {data.form1.avgFreedom !== null && data.form2.avgFreedom !== null && (
                  <div style={{ ...s.statCard, borderTop: `3px solid #9B59B6` }}>
                    <div style={{ ...s.statVal, color: '#9B59B6' }}>
                      {Math.abs(data.form1.avgFreedom - data.form2.avgFreedom).toFixed(1)}
                    </div>
                    <div style={s.statLabel}>Felt-free score gap (out of 7)</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div style={s.btnRow}>
          <button style={{ ...s.btn, ...s.btnRefresh }} onClick={fetchData}>↻ Refresh now</button>
          <button
            style={{ ...s.btn, ...s.btnReset, ...(confirmReset ? { background: CORAL, color: WHITE } : {}) }}
            onClick={handleResetClick}
            disabled={resetting}
          >
            {resetting ? 'Resetting…' : confirmReset ? '⚠ Confirm reset?' : 'Reset all data'}
          </button>
        </div>
      </div>
    </div>
  );
}
