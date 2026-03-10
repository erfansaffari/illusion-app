// Vercel KV wrapper — falls back to in-memory for local dev
let mem = { responses: [] };

async function getKV() {
  try {
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch {
    return null;
  }
}

export async function addResponse(data) {
  const kv = await getKV();
  if (kv) {
    const responses = await kv.get('responses') || [];
    responses.push({ ...data, ts: Date.now() });
    await kv.set('responses', responses);
  } else {
    mem.responses.push({ ...data, ts: Date.now() });
  }
}

export async function getResponses() {
  const kv = await getKV();
  if (kv) {
    return (await kv.get('responses')) || [];
  }
  return mem.responses;
}

export async function resetResponses() {
  const kv = await getKV();
  if (kv) {
    await kv.set('responses', []);
  } else {
    mem.responses = [];
  }
}
