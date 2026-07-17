import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

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
