if (typeof window !== 'undefined') {
  throw new Error('Prisma client cannot be used in the browser. This is a server-only module.');
}

export * from './prisma';
export { default } from './prisma';
