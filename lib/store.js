// Uses Redis RPUSH/LRANGE for atomic appends — no race conditions.
// On first load, migrates any legacy single-key array to the list format.
let mem = [];

async function getKV() {
  const url = process.env.commst_KV_REST_API_URL;
  const token = process.env.commst_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const { createClient } = await import('@vercel/kv');
    return createClient({ url, token });
  } catch {
    return null;
  }
}

async function migrate(kv) {
  try {
    const type = await kv.type('responses');
    if (type === 'string') {
      const old = await kv.get('responses');
      const items = Array.isArray(old) ? old : [];
      await kv.del('responses');
      for (const item of items) {
        await kv.rpush('responses', JSON.stringify(item));
      }
    }
  } catch { }
}

export async function addResponse(data) {
  const kv = await getKV();
  const entry = JSON.stringify({ ...data, ts: Date.now() });
  if (kv) {
    await migrate(kv);
    await kv.rpush('responses', entry);
  } else {
    mem.push({ ...data, ts: Date.now() });
  }
}

export async function getResponses() {
  const kv = await getKV();
  if (kv) {
    await migrate(kv);
    const raw = await kv.lrange('responses', 0, -1);
    return (raw || []).map(r => typeof r === 'string' ? JSON.parse(r) : r);
  }
  return mem;
}

export async function resetResponses() {
  const kv = await getKV();
  if (kv) {
    await kv.del('responses');
  } else {
    mem = [];
  }
}