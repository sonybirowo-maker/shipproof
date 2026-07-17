import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { createReleasePacket, sha256File } from "../lib/proof-engine.mjs";

const root = path.resolve(import.meta.dirname, "..");
const config = JSON.parse(await readFile(path.join(root, "shipproof.config.json"), "utf8"));

test("hashes evidence artifacts with SHA-256", async () => {
  const digest = await sha256File(root, "lib/rate-limit.mjs");
  assert.match(digest, /^[a-f0-9]{64}$/);
});

test("creates a sealed packet from passing verification", async () => {
  const packet = await createReleasePacket({ root, config, verification: { passed: true, tests: 4, passed_tests: 4, failed_tests: 0 } });
  assert.equal(packet.gates.adversarial_qa, "PASS");
  assert.equal(packet.gates.human_approval, "REQUIRED");
  assert.equal(packet.telemetry.usage_status, "NOT_AVAILABLE");
  assert.equal(packet.artifacts.length, 2);
  assert.match(packet.integrity.seal, /^[a-f0-9]{64}$/);
});

test("fails closed when verification does not pass", async () => {
  const packet = await createReleasePacket({ root, config, verification: { passed: false, tests: 4, passed_tests: 3, failed_tests: 1 } });
  assert.equal(packet.gates.build, "FAIL");
  assert.equal(packet.gates.adversarial_qa, "FAIL");
  assert.ok(packet.artifacts.every((artifact) => artifact.result === "UNVERIFIED"));
});
