import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

export function parseNodeTestSummary(output) {
  const normalized = String(output).replace(/\u001b\[[0-9;]*m/g, "");
  const readCount = (label) => {
    const match = normalized.match(new RegExp(`^(?:ℹ|#)\\s+${label}\\s+(\\d+)\\s*$`, "m"));
    return Number(match?.[1] || 0);
  };

  return {
    tests: readCount("tests"),
    passed_tests: readCount("pass"),
    failed_tests: readCount("fail"),
  };
}

export async function sha256File(root, relativePath) {
  const bytes = await readFile(path.resolve(root, relativePath));
  return createHash("sha256").update(bytes).digest("hex");
}

export async function createReleasePacket({ root, config, verification }) {
  const artifacts = [];
  for (const artifact of config.artifacts) {
    artifacts.push({
      ...artifact,
      sha256: await sha256File(root, artifact.path),
      result: verification.passed ? "VERIFIED" : "UNVERIFIED",
    });
  }

  const proofBody = {
    schema: "shipproof.release-packet.v1",
    mission: config.mission,
    verification,
    artifacts,
    gates: {
      contract: "PASS",
      build: verification.passed ? "PASS" : "FAIL",
      adversarial_qa: verification.passed ? "PASS" : "FAIL",
      human_approval: config.approval.required ? "REQUIRED" : "NOT_REQUIRED",
    },
    telemetry: {
      model: "GPT-5.6",
      agent: "Codex",
      usage_status: "NOT_AVAILABLE",
      note: "No token or cost figure is fabricated when the original call boundary is unavailable."
    }
  };

  const seal = createHash("sha256").update(JSON.stringify(proofBody)).digest("hex");
  return { ...proofBody, integrity: { algorithm: "SHA-256", seal } };
}
