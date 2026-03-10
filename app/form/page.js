'use client';
import { useState, useEffect, useRef } from 'react';

const NAVY = '#0C1931';
const AMBER = '#E8A020';
const TEAL = '#0AAFA0';
const CORAL = '#D94F3D';

const s = {
  page: { minHeight: '100vh', background: '#f5f4f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 40px' },
  card: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.09)', width: '100%', maxWidth: 480, padding: '28px 24px', marginTop: 8 },
  logo: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: AMBER, marginBottom: 6 },
  h1: { fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 4 },
  sub: { fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 1.5 },
  label: { fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6, display: 'block' },
  input: { width: '100%', border: '1.5px solid #ddd', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: NAVY, outline: 'none', marginBottom: 14, fontFamily: 'inherit' },
  textarea: { width: '100%', border: '1.5px solid #ddd', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: NAVY, outline: 'none', marginBottom: 14, fontFamily: 'inherit', minHeight: 80, resize: 'vertical' },
  sliderWrap: { marginBottom: 16 },
  sliderRow: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginTop: 4 },
  slider: { width: '100%', accentColor: TEAL },
  btnYes: { width: '100%', background: TEAL, color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
  btnNo: { width: '100%', background: '#fff', color: '#666', border: '1.5px solid #ccc', borderRadius: 8, padding: '13px', fontSize: 15, cursor: 'pointer', marginBottom: 10 },
  btnNoEasy: { width: '100%', background: '#fff', color: CORAL, border: `1.5px solid ${CORAL}`, borderRadius: 8, padding: '13px', fontSize: 15, cursor: 'pointer', marginBottom: 10 },
  divider: { border: 'none', borderTop: '1px solid #eee', margin: '16px 0' },
  tag: { display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: '3px 8px', borderRadius: 4, marginBottom: 14 },
  timeSlot: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13 },
  guiltBox: { background: '#fff4f3', border: `1.5px solid ${CORAL}`, borderRadius: 8, padding: 14, marginBottom: 14, fontSize: 13, color: '#b03020', lineHeight: 1.55 },
  altList: { marginBottom: 14 },
  altItem: { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 },
  doneCard: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.09)', width: '100%', maxWidth: 480, padding: '36px 24px', marginTop: 8, textAlign: 'center' },
  check: { fontSize: 48, marginBottom: 12 },
};

// ── FORM 1: friction on YES ──────────────────────────────────────────────────
function Form1({ onDone }) {
  const startRef = useRef(Date.now());
  const [commitment, setCommitment] = useState('');
  const [slots, setSlots] = useState([]);
  const [ack, setAck] = useState(false);
  const [freedom, setFreedom] = useState(4);
  const [error, setError] = useState('');

  const SLOTS = ['Mon 10–10:15am', 'Mon 2–2:15pm', 'Tue 11–11:15am', 'Wed 9–9:15am', 'Thu 3–3:15pm', 'Fri 12–12:15pm'];

  function toggleSlot(s) {
    setSlots(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function submitYes() {
    if (!commitment.trim()) return setError('Please write a short commitment statement.');
    if (slots.length < 3) return setError('Select at least 3 available time slots.');
    if (!ack) return setError('Please check the acknowledgement box.');
    setError('');
    onDone({ form: 1, answer: 'yes', freedom, elapsed: Date.now() - startRef.current });
  }

  function submitNo() {
    onDone({ form: 1, answer: 'no', freedom, elapsed: Date.now() - startRef.current });
  }

  return (
    <div style={s.card}>
      <div style={s.logo}>UNIVERSITY OF WATERLOO</div>
      <h1 style={s.h1}>UW Peer Accountability Program</h1>
      <p style={s.sub}>A 15-minute weekly check-in with a matched peer to help you stay on track with academic goals. Completely voluntary.</p>
      <hr style={s.divider} />
      <span style={{ ...s.tag, background: '#fff3cd', color: '#7a5c00' }}>FORM A</span>

      <label style={s.label}>Why do you want to join? <span style={{ color: CORAL }}>*</span></label>
      <textarea style={s.textarea} placeholder="Write a short commitment statement explaining your goals..." value={commitment} onChange={e => setCommitment(e.target.value)} rows={3} />

      <label style={s.label}>Select your available time slots (minimum 3) <span style={{ color: CORAL }}>*</span></label>
      {SLOTS.map(slot => (
        <div key={slot} style={{ ...s.timeSlot, borderColor: slots.includes(slot) ? TEAL : '#ddd', background: slots.includes(slot) ? '#f0faf9' : '#fff' }} onClick={() => toggleSlot(slot)}>
          <span style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${slots.includes(slot) ? TEAL : '#ccc'}`, background: slots.includes(slot) ? TEAL : '#fff', flexShrink: 0, display: 'inline-block' }} />
          {slot}
        </div>
      ))}

      <div style={{ marginBottom: 14, marginTop: 4 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => setAck(!ack)}>
          <span style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${ack ? TEAL : '#ccc'}`, background: ack ? TEAL : '#fff', flexShrink: 0, marginTop: 2, display: 'inline-block' }} />
          <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>I understand this is a 15-minute weekly commitment and I will make every effort to attend.</span>
        </div>
      </div>

      <div style={s.sliderWrap}>
        <label style={s.label}>How free did you feel making this decision? <span style={{ fontWeight: 400, color: '#888' }}>(1 = not at all, 7 = completely)</span></label>
        <input type="range" min={1} max={7} value={freedom} onChange={e => setFreedom(+e.target.value)} style={s.slider} />
        <div style={s.sliderRow}><span>1 — not at all</span><span style={{ fontWeight: 700, color: TEAL }}>{freedom}</span><span>7 — completely</span></div>
      </div>

      {error && <p style={{ color: CORAL, fontSize: 13, marginBottom: 10 }}>{error}</p>}

      <button style={s.btnYes} onClick={submitYes}>Yes, I want to join →</button>
      <button style={s.btnNo} onClick={submitNo}>No thanks</button>
    </div>
  );
}

// ── FORM 2: friction on NO ───────────────────────────────────────────────────
function Form2({ onDone }) {
  const startRef = useRef(Date.now());
  const [declined, setDeclined] = useState(false);
  const [reason, setReason] = useState('');
  const [alts, setAlts] = useState([]);
  const [guiltConfirm, setGuiltConfirm] = useState(false);
  const [freedom, setFreedom] = useState(4);
  const [error, setError] = useState('');

  const ALTS = [
    'I already have enough support systems',
    'I prefer to manage my own time independently',
    'My schedule is too unpredictable',
    'I will use other UW resources instead',
  ];

  function submitYes() {
    onDone({ form: 2, answer: 'yes', freedom, elapsed: Date.now() - startRef.current });
  }

  function tryNo() {
    if (!declined) return setDeclined(true);
    if (!reason.trim()) return setError('Please explain why you are opting out.');
    if (alts.length === 0) return setError('Please select at least one alternative.');
    if (!guiltConfirm) return setError('Please confirm your opt-out.');
    setError('');
    onDone({ form: 2, answer: 'no', freedom, elapsed: Date.now() - startRef.current });
  }

  function toggleAlt(a) {
    setAlts(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  return (
    <div style={s.card}>
      <div style={s.logo}>UNIVERSITY OF WATERLOO</div>
      <h1 style={s.h1}>UW Peer Accountability Program</h1>
      <p style={s.sub}>A 15-minute weekly check-in with a matched peer to help you stay on track with academic goals. Completely voluntary.</p>
      <hr style={s.divider} />
      <span style={{ ...s.tag, background: '#e8f4f8', color: '#0A5A70' }}>FORM B</span>

      <div style={s.sliderWrap}>
        <label style={s.label}>How free did you feel making this decision? <span style={{ fontWeight: 400, color: '#888' }}>(1 = not at all, 7 = completely)</span></label>
        <input type="range" min={1} max={7} value={freedom} onChange={e => setFreedom(+e.target.value)} style={s.slider} />
        <div style={s.sliderRow}><span>1 — not at all</span><span style={{ fontWeight: 700, color: TEAL }}>{freedom}</span><span>7 — completely</span></div>
      </div>

      <button style={s.btnYes} onClick={submitYes}>Yes, sign me up →</button>

      {!declined ? (
        <button style={s.btnNoEasy} onClick={() => setDeclined(true)}>No thanks</button>
      ) : (
        <>
          <hr style={s.divider} />
          <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>Before opting out, please help us understand your decision.</p>

          <label style={s.label}>Why are you declining? <span style={{ color: CORAL }}>*</span></label>
          <textarea style={s.textarea} placeholder="Please explain your reason for not joining..." value={reason} onChange={e => setReason(e.target.value)} rows={2} />

          <label style={s.label}>Which of the following will you use instead? (select all that apply) <span style={{ color: CORAL }}>*</span></label>
          <div style={s.altList}>
            {ALTS.map(a => (
              <div key={a} style={{ ...s.altItem, borderColor: alts.includes(a) ? TEAL : '#ddd', background: alts.includes(a) ? '#f0faf9' : '#fff' }} onClick={() => toggleAlt(a)}>
                <span style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${alts.includes(a) ? TEAL : '#ccc'}`, background: alts.includes(a) ? TEAL : '#fff', flexShrink: 0, marginTop: 1, display: 'inline-block' }} />
                {a}
              </div>
            ))}
          </div>

          <div style={s.guiltBox}>
            <strong>Please note:</strong> Students who participate in peer accountability programs report significantly higher academic satisfaction and course completion rates. By opting out, you may be missing a meaningful opportunity for support.
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 16, cursor: 'pointer' }} onClick={() => setGuiltConfirm(!guiltConfirm)}>
            <span style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${guiltConfirm ? CORAL : '#ccc'}`, background: guiltConfirm ? CORAL : '#fff', flexShrink: 0, marginTop: 2, display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>I confirm I want to opt out and I understand I may not be able to join later in the term.</span>
          </div>

          {error && <p style={{ color: CORAL, fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <button style={s.btnNoEasy} onClick={tryNo}>Confirm opt-out</button>
        </>
      )}
    </div>
  );
}

// ── DONE ─────────────────────────────────────────────────────────────────────
function Done() {
  return (
    <div style={s.doneCard}>
      <div style={s.check}>✓</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Both forms submitted.</h2>
      <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>Thank you. Your responses are anonymous and will be shown to the class during the results reveal.</p>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function FormPage() {
  const [step, setStep] = useState(0); // 0=form1, 1=form2, 2=done
  const [f1, setF1] = useState(null);

  async function submitResponse(data) {
    try {
      await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } catch {}
  }

  async function handleF1(data) {
    setF1(data);
    await submitResponse(data);
    setStep(1);
    window.scrollTo(0, 0);
  }

  async function handleF2(data) {
    await submitResponse(data);
    setStep(2);
    window.scrollTo(0, 0);
  }

  return (
    <div style={s.page}>
      {step === 0 && (
        <>
          <p style={{ fontSize: 12, color: '#999', marginBottom: 8, textAlign: 'center' }}>Step 1 of 2</p>
          <Form1 onDone={handleF1} />
        </>
      )}
      {step === 1 && (
        <>
          <p style={{ fontSize: 12, color: '#999', marginBottom: 8, textAlign: 'center' }}>Step 2 of 2</p>
          <Form2 onDone={handleF2} />
        </>
      )}
      {step === 2 && <Done />}
    </div>
  );
}
