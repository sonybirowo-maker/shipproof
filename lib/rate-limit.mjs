/** Deterministic identity-aware token-bucket used by the ShipProof sample API. */
export class LoginRateLimiter {
  constructor({ limit = 5, windowMs = 60_000, now = () => Date.now() } = {}) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
    this.buckets = new Map();
  }

  normalizeIdentity(identity) {
    return String(identity ?? "").trim().toLowerCase();
  }

  check({ identity, ip }) {
    const normalized = this.normalizeIdentity(identity);
    const key = normalized ? `identity:${normalized}` : `ip:${ip || "unknown"}`;
    const timestamp = this.now();
    const current = this.buckets.get(key);
    const bucket = !current || timestamp >= current.resetAt
      ? { count: 0, resetAt: timestamp + this.windowMs }
      : current;

    bucket.count += 1;
    this.buckets.set(key, bucket);
    const allowed = bucket.count <= this.limit;
    return {
      allowed,
      remaining: Math.max(0, this.limit - bucket.count),
      retryAfterSeconds: allowed ? 0 : Math.max(1, Math.ceil((bucket.resetAt - timestamp) / 1000)),
      identityKey: key,
    };
  }
}
