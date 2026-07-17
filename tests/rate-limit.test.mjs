import assert from "node:assert/strict";
import test from "node:test";
import { LoginRateLimiter } from "../lib/rate-limit.mjs";

test("allows five attempts and rejects the sixth", () => {
  const limiter = new LoginRateLimiter({ now: () => 1_000 });
  for (let i = 0; i < 5; i += 1) assert.equal(limiter.check({ identity: "Ada@example.com", ip: `10.0.0.${i}` }).allowed, true);
  const denied = limiter.check({ identity: "ada@example.com", ip: "203.0.113.9" });
  assert.equal(denied.allowed, false);
  assert.equal(denied.retryAfterSeconds, 60);
});

test("rotating IP addresses cannot bypass identity limit", () => {
  const limiter = new LoginRateLimiter({ limit: 2, now: () => 2_000 });
  assert.equal(limiter.check({ identity: "victim@example.com", ip: "198.51.100.1" }).allowed, true);
  assert.equal(limiter.check({ identity: "VICTIM@example.com ", ip: "198.51.100.2" }).allowed, true);
  assert.equal(limiter.check({ identity: "victim@example.com", ip: "198.51.100.3" }).allowed, false);
});

test("anonymous attempts fall back to the IP identity", () => {
  const limiter = new LoginRateLimiter({ limit: 1, now: () => 3_000 });
  assert.equal(limiter.check({ ip: "192.0.2.1" }).allowed, true);
  assert.equal(limiter.check({ ip: "192.0.2.1" }).allowed, false);
  assert.equal(limiter.check({ ip: "192.0.2.2" }).allowed, true);
});

test("bucket resets after the configured window", () => {
  let now = 0;
  const limiter = new LoginRateLimiter({ limit: 1, windowMs: 1_000, now: () => now });
  assert.equal(limiter.check({ identity: "dev@example.com" }).allowed, true);
  assert.equal(limiter.check({ identity: "dev@example.com" }).allowed, false);
  now = 1_000;
  assert.equal(limiter.check({ identity: "dev@example.com" }).allowed, true);
});
