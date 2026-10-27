/**
 * BioPay Redis Client Singleton (Server-Only)
 * Supports real Redis when REDIS_URL is provided,
 * with automatic resilient fallback to memory cache if Redis is unavailable or in test mode.
 */

if (typeof window !== 'undefined') {
  throw new Error('Redis client cannot be used in the browser. This is a server-only module.');
}

import Redis from 'ioredis';

interface MemoryEntry {
  value: string;
  expiresAt?: number;
}
const memoryStore = new Map<string, MemoryEntry>();

let redisClient: Redis | null = null;
let isRedisReady = false;

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const isTest = process.env.NODE_ENV === 'test';

if (!isTest) {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 100, 1000);
      },
      lazyConnect: true,
    });

    redisClient.connect().then(() => {
      isRedisReady = true;
      console.log('[Redis] Connected successfully to', redisUrl);
    }).catch((err) => {
      isRedisReady = false;
      console.log('[Redis Notice] Running in resilient fallback mode (Redis server offline):', err.message);
    });

    redisClient.on('error', () => {
      isRedisReady = false;
    });

    redisClient.on('ready', () => {
      isRedisReady = true;
    });
  } catch (e: any) {
    console.log('[Redis Notice] Fallback cache active:', e.message);
    redisClient = null;
    isRedisReady = false;
  }
}

export async function redisGet(key: string): Promise<string | null> {
  if (redisClient && isRedisReady) {
    try {
      return await redisClient.get(key);
    } catch {
      // fallback
    }
  }

  const entry = memoryStore.get(key);
  if (!entry) return null;

  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }

  return entry.value;
}

export async function redisSet(
  key: string,
  value: string,
  expireSeconds?: number
): Promise<'OK' | boolean> {
  if (redisClient && isRedisReady) {
    try {
      if (expireSeconds) {
        return await redisClient.set(key, value, 'EX', expireSeconds);
      }
      return await redisClient.set(key, value);
    } catch {
      // fallback
    }
  }

  const expiresAt = expireSeconds ? Date.now() + expireSeconds * 1000 : undefined;
  memoryStore.set(key, { value, expiresAt });
  return true;
}

export async function redisDel(key: string): Promise<number> {
  if (redisClient && isRedisReady) {
    try {
      return await redisClient.del(key);
    } catch {
      // fallback
    }
  }

  const existed = memoryStore.delete(key);
  return existed ? 1 : 0;
}

export async function redisIncrement(key: string): Promise<number> {
  if (redisClient && isRedisReady) {
    try {
      return await redisClient.incr(key);
    } catch {
      // fallback
    }
  }

  const current = parseInt((await redisGet(key)) || '0', 10);
  const next = current + 1;
  await redisSet(key, next.toString());
  return next;
}

export async function redisExpire(key: string, seconds: number): Promise<boolean> {
  if (redisClient && isRedisReady) {
    try {
      return (await redisClient.expire(key, seconds)) === 1;
    } catch {
      // fallback
    }
  }

  const entry = memoryStore.get(key);
  if (entry) {
    entry.expiresAt = Date.now() + seconds * 1000;
    return true;
  }
  return false;
}

export function getRedisClient(): Redis | null {
  return redisClient;
}

export default redisClient;
