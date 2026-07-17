# ShipProof

**Codex can write the change. ShipProof proves the change is safe to ship.**

ShipProof is an evidence-native developer tool built for OpenAI Build Week 2026. It connects an engineering requirement to the Codex-authored diff, adversarial tests, a human approval gate, and a downloadable release packet.

## Working demo

[Open the hosted demo](https://shipproof-demo.dtc-dawah-id.chatgpt.site), select **Run verification**, observe the adversarial QA stage, then approve and download the release packet.

## Why it exists

AI coding agents make code faster, but engineering teams still need to answer: What requirement caused this change? Which tests prove it? What risk was discovered? Who approved release? ShipProof makes that chain visible and machine-readable.

## Features

- Requirement → diff → test proof graph
- Deterministic five-stage verification run
- Visible adversarial failure and remediation state
- Human-controlled release approval
- Downloadable JSON release packet
- Identity-aware sample login rate limiter
- Adversarial test proving rotating IPs cannot bypass an account limit
- Responsive and reduced-motion-aware interface

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Test

```bash
node --test tests/rate-limit.test.mjs
npm run lint
npm run build
```

## Codex and GPT-5.6 collaboration

GPT-5.6 in Codex was used for product strategy, interaction architecture, implementation, adversarial test design, browser QA, and deployment. The founder retained the key decisions: choose the Developer Tools track, focus on verifiable releases rather than a generic multi-agent dashboard, require a deterministic demo path, and preserve a human approval boundary.

The Build Week contribution began after July 13, 2026. Commit history and the submitted Codex `/feedback` session document the work completed during the eligibility period.

## Supported platform

- Hosted web application: current desktop and mobile browsers
- Local development: Node.js 22.13+
- No API key is required for deterministic judge testing

## Repository map

- `app/page.tsx` — interactive product experience
- `app/globals.css` — responsive visual system
- `lib/rate-limit.mjs` — sample identity-aware rate limiter
- `tests/rate-limit.test.mjs` — functional and adversarial tests
- `evidence/demo-release-packet.json` — machine-readable example attestation

## License

MIT
