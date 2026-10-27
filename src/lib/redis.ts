if (typeof window !== 'undefined') {
  throw new Error('Redis client cannot be used in the browser. This is a server-only module.');
}

export * from './redis.server';
export { default } from './redis.server';
