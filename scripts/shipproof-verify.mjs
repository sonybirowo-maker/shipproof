#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createReleasePacket } from "../lib/proof-engine.mjs";

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

const match = output.match(/ℹ tests (\d+)/);
const passedMatch = output.match(/ℹ pass (\d+)/);
const failedMatch = output.match(/ℹ fail (\d+)/);
const verification = {
  command: config.verification.command,
  passed: passed && Number(failedMatch?.[1] || 0) === 0 && Number(passedMatch?.[1] || 0) >= config.verification.minimum_tests,
  tests: Number(match?.[1] || 0),
  passed_tests: Number(passedMatch?.[1] || 0),
  failed_tests: Number(failedMatch?.[1] || 0),
};

const packet = await createReleasePacket({ root, config, verification });
await mkdir(path.join(root, "artifacts"), { recursive: true });
await writeFile(path.join(root, "artifacts/release-packet.json"), `${JSON.stringify(packet, null, 2)}\n`);

console.log(`SHIPPROOF_VERDICT=${verification.passed ? "PASS" : "FAIL"}`);
console.log(`SHIPPROOF_TESTS=${verification.passed_tests}/${verification.tests}`);
console.log(`SHIPPROOF_SEAL=${packet.integrity.seal}`);
console.log("SHIPPROOF_PACKET=artifacts/release-packet.json");
if (!verification.passed) process.exitCode = 1;
