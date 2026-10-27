/**
 * BioPay Redis Client Singleton
 * Supports real Redis when REDIS_URL is provided,
 * with automatic resilient fallback to memory cache if Redis is unavailable or in test mode.
 */

import Redis from 'ioredis';

// In-memory fallback storage
interface MemoryEntry {
  value: string;
  expiresAt?: number;
}
const memoryStore = new Map<string, MemoryEntry>();

let redisClient: Redis | null = null;
let isRedisReady = false;

// Only initialize ioredis in Node.js server runtime
if (typeof window === 'undefined') {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const isTest = process.env.NODE_ENV === 'test';

  if (!isTest) {
    try {
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        retryStrategy: (times) => {
          if (times > 3) return null; // stop retrying after 3 attempts
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

      redisClient.on('error', (err) => {
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
}

/**
 * Get value from Redis or Memory Store
 */
export async function redisGet(key: string): Promise<string | null> {
  if (isRedisReady && redisClient) {
    try {
      return await redisClient.get(key);
    } catch {
      // Fallback to memory
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

/**
 * Set value with optional TTL (seconds) in Redis or Memory Store
 */
export async function redisSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (isRedisReady && redisClient) {
    try {
      if (ttlSeconds) {
        await redisClient.set(key, value, 'EX', ttlSeconds);
      } else {
        await redisClient.set(key, value);
      }
      return;
    } catch {
      // Fallback to memory
    }
  }

  const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
  memoryStore.set(key, { value, expiresAt });
}

/**
 * Delete key from Redis or Memory Store
 */
export async function redisDel(key: string): Promise<void> {
  if (isRedisReady && redisClient) {
    try {
      await redisClient.del(key);
      return;
    } catch {
      // Fallback to memory
    }
  }
  memoryStore.delete(key);
}

/**
 * Increment counter with TTL
 */
export async function redisIncr(key: string, ttlSeconds: number = 3600): Promise<number> {
  if (isRedisReady && redisClient) {
    try {
      const count = await redisClient.incr(key);
      if (count === 1) {
        await redisClient.expire(key, ttlSeconds);
      }
      return count;
    } catch {
      // Fallback to memory
    }
  }

  const entry = memoryStore.get(key);
  const now = Date.now();
  if (!entry || (entry.expiresAt && now > entry.expiresAt)) {
    memoryStore.set(key, { value: '1', expiresAt: now + ttlSeconds * 1000 });
    return 1;
  }

  const nextVal = (parseInt(entry.value, 10) || 0) + 1;
  entry.value = nextVal.toString();
  return nextVal;
}

export { redisClient };
