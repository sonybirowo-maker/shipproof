# Devpost Submission Draft

## Project name

ShipProof

## Tagline

Codex can write the change. ShipProof proves the change is safe to ship.

## Category

Developer Tools

## Inspiration

AI coding agents can create substantial changes in minutes, but teams still struggle to answer basic release questions: Which requirement caused this diff? Which test proves the behavior? What failure was discovered? Who approved the release? We built ShipProof to make AI-assisted delivery accountable rather than merely fast.

## What it does

ShipProof connects an engineering mission to its implementation, adversarial tests, release gates, and human approval. Its interactive proof graph lets a reviewer follow requirement → diff → test. Its CLI executes the verification suite, hashes evidence artifacts, fails closed on errors, and produces a machine-readable release packet sealed with SHA-256.

The demo protects a login API with identity-aware rate limiting. Adversarial QA tests whether an attacker can rotate IP addresses to bypass the account limit. ShipProof surfaces the risk, verifies the remediation, and unlocks approval only after all evidence passes.

## How we built it

- GPT-5.6 and Codex for product strategy, architecture, implementation, test design, browser QA, and deployment.
- React 19, TypeScript, Next.js/Vinext, and Cloudflare-compatible output.
- Node.js built-in test runner for functional and adversarial verification.
- SHA-256 content hashing for evidence artifacts and packet integrity.
- GitHub Actions for repeatable install, lint, tests, CLI verification, and build.

## How Codex accelerated the work

Codex compressed a solo founder workflow into a single traceable build thread: research and positioning, three visual directions, implementation, browser testing, failure recovery after workspace maintenance, deployment, GitHub integration, adversarial QA, and submission preparation. The founder made the defining decisions: reject a generic multi-agent dashboard, focus on verifiable releases, preserve human approval, and use a deterministic judge path.

## Challenges

The initial GitHub connector was read-only, and an early uncheckpointed workspace was removed by automated maintenance. We recovered from the immutable Site identity, installed the official OpenAI Codex GitHub App, verified write access with a real commit, and automated repository sync. This reinforced the product thesis: important AI work needs durable, verifiable evidence rather than trust in transient state.

## Accomplishments

- Coherent, responsive product experience rather than a static proof of concept.
- Executable adversarial test for rotating-IP bypass.
- Fail-closed verification CLI with actual test counts.
- Content-addressed evidence and sealed JSON release packet.
- Explicit human approval boundary.
- Public repository, live judge-ready demo, and automated CI.

## What we learned

The hardest problem in agentic software delivery is not generating more code. It is making the path from intent to release understandable and defensible. Evidence must be generated at the execution boundary, not reconstructed afterward.

## What's next

ShipProof can become the trust layer between coding agents and enterprise delivery: repository adapters, policy-as-code, CI integrations, signed attestations, pull-request checks, audit exports, and organization-level release analytics.

## Links

- Demo: https://shipproof-demo.dtc-dawah-id.chatgpt.site
- Repository: https://github.com/sonybirowo-maker/shipproof
- License: MIT

## Submission placeholders

- Public YouTube URL: `TODO`
- Codex `/feedback` Session ID: `TODO`
