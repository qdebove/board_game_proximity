const buckets = new Map<string, { count: number; expiresAt: number }>();

export function softRateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(identifier);
  if (bucket && bucket.expiresAt > now) {
    if (bucket.count >= limit) {
      return false;
    }
    bucket.count += 1;
    return true;
  }
  buckets.set(identifier, { count: 1, expiresAt: now + windowMs });
  return true;
}