# ShipProof Demo Video Script

Target duration: **2:45**. Language: English. Record at 1080p with the full proof graph and inspector visible.

## 0:00–0:18 — Hook

**Visual:** ShipProof mission screen.

> AI coding agents can write a production change in minutes. But before a team ships it, they still need proof: what requirement caused the change, what test validates it, what risk was found, and who approved release. This is ShipProof.

## 0:18–0:38 — Product promise

**Visual:** Requirement, diff, and test nodes.

> ShipProof is an evidence-native release verifier for AI-generated code. It connects the mission to the Codex patch, adversarial QA, and a human-controlled release gate.

## 0:38–1:25 — Live workflow

**Action:** Click **Run verification**.

> This mission protects a login API with identity-aware rate limiting. The Codex-authored implementation applies identity-aware rate limiting. Adversarial QA then attacks it by rotating IP addresses while keeping the same account identity. ShipProof exposes the bypass risk, verifies the remediation, and links every result into one proof graph.

Pause briefly on the risk state, then let confidence reach 94%.

## 1:25–1:52 — Human control

**Action:** Click the test node, then **Approve release**.

> Automation cannot approve its own consequential action. The release control stays locked until every evidence gate passes. A human explicitly approves, and ShipProof seals the release packet.

## 1:52–2:18 — Technical proof

**Visual:** Terminal running `npm run verify:demo`, followed by the JSON packet.

> Under the interface, this is executable—not a confidence animation. The full project gate passes eight checks, including four adversarial rate-limit checks. The CLI records actual pass and fail counts, hashes the implementation and test files, fails closed on errors, and creates a machine-readable packet with a SHA-256 integrity seal.

## 2:18–2:38 — Codex and GPT-5.6

**Visual:** Repository and commit history.

> I built ShipProof as a solo founder with GPT-5.6 and Codex: product strategy, architecture, UI implementation, adversarial testing, browser QA, deployment, GitHub automation, and recovery from a real infrastructure failure—through a traceable Build Week workflow.

## 2:38–2:45 — Close

**Visual:** Return to sealed proof graph.

> AI can generate code. ShipProof proves it can be delivered responsibly.

## Recording checklist

- Public YouTube video, less than three minutes.
- Spoken audio explicitly mentions both Codex and GPT-5.6.
- No copyrighted music or third-party trademarks.
- Show the working product, not presentation slides.
- Do not expose account data, tokens, or private tabs.
