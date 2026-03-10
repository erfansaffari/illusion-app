import { Redis } from '@upstash/redis';

let _redis = null;

function getRedis() {
  if (_redis) return _redis;
  const url = process.env.commst_KV_REST_API_URL;
  const token = process.env.commst_KV_REST_API_TOKEN;
  if (!url || !token) {
    console.warn('[store] Redis env vars not found — falling back to in-memory (not suitable for production)');
    return null;
  }
  try {
    _redis = new Redis({ url, token });
    return _redis;
  } catch (e) {
    console.error('[store] Redis init failed:', e);
    return null;
  }
}

// In-memory fallback (dev only — not shared across serverless instances)
let mem = [];

export async function addResponse(data) {
  const redis = getRedis();
  if (redis) {
    await redis.rpush('responses', JSON.stringify({ ...data, ts: Date.now() }));
  } else {
    mem.push({ ...data, ts: Date.now() });
  }
}

export async function getResponses() {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.lrange('responses', 0, -1);
    return (raw || []).map(r => typeof r === 'string' ? JSON.parse(r) : r);
  }
  return mem;
}

export async function resetResponses() {
  const redis = getRedis();
  if (redis) {
    await redis.del('responses');
  } else {
    mem = [];
  }
}
