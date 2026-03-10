// Vercel KV with custom "commst_" prefix env vars
let mem = { responses: [] };

async function getKV() {
  const url   = process.env.commst_KV_REST_API_URL;
  const token = process.env.commst_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const { createClient } = await import('@vercel/kv');
    return createClient({ url, token });
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
  if (kv) return (await kv.get('responses')) || [];
  return mem.responses;
}

export async function resetResponses() {
  const kv = await getKV();
  if (kv) await kv.set('responses', []);
  else mem.responses = [];
}
