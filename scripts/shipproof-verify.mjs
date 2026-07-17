#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createReleasePacket, parseNodeTestSummary } from "../lib/proof-engine.mjs";

const root = process.cwd();
const config = JSON.parse(await readFile(path.join(root, "shipproof.config.json"), "utf8"));
let output = "";
let passed = false;

try {
  output = execFileSync(process.execPath, ["--test", "tests/rate-limit.test.mjs"], { cwd: root, encoding: "utf8" });
  passed = true;
} catch (error) {
  output = `${error.stdout || ""}\n${error.stderr || ""}`.trim();
}

const summary = parseNodeTestSummary(output);
const verification = {
  command: config.verification.command,
  passed: passed && summary.failed_tests === 0 && summary.passed_tests >= config.verification.minimum_tests,
  ...summary,
};

const packet = await createReleasePacket({ root, config, verification });
await mkdir(path.join(root, "artifacts"), { recursive: true });
await writeFile(path.join(root, "artifacts/release-packet.json"), `${JSON.stringify(packet, null, 2)}\n`);

console.log(`SHIPPROOF_VERDICT=${verification.passed ? "PASS" : "FAIL"}`);
console.log(`SHIPPROOF_TESTS=${verification.passed_tests}/${verification.tests}`);
console.log(`SHIPPROOF_SEAL=${packet.integrity.seal}`);
console.log("SHIPPROOF_PACKET=artifacts/release-packet.json");
if (!verification.passed) process.exitCode = 1;
