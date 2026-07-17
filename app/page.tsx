"use client";

import { useEffect, useState } from "react";

const stages = ["Contract", "Build", "Adversarial QA", "Approval", "Release"];
const evidence = [
  { type: "Requirement", id: "REQ-1024", title: "Protect the login API", body: "Allow five attempts per minute per identity. Reject excess attempts with HTTP 429 without blocking valid sessions.", meta: "3 acceptance criteria" },
  { type: "Codex patch", id: "DIF-7F3B2C1", title: "Token-bucket middleware", body: "Adds identity-aware rate limiting, retry headers, and an injectable clock for deterministic verification.", meta: "+128 −14 · 4 files" },
  { type: "Adversarial test", id: "TST-9C1A7E8", title: "Rotating-IP bypass", body: "Proves an attacker cannot reset the limit by changing IP while preserving the same normalized account identity.", meta: "4/4 adversarial checks" },
];

export default function Home() {
  const [phase, setPhase] = useState(0);
  const [selected, setSelected] = useState(0);
  const [running, setRunning] = useState(false);
  const [approved, setApproved] = useState(false);
  const confidence = [62, 78, 71, 94, 100][phase];

  useEffect(() => {
    if (!running) return;
    let next = 1;
    const timer = window.setInterval(() => {
      setPhase(next); setSelected(Math.min(next, 2)); next += 1;
      if (next === 4) { window.clearInterval(timer); setRunning(false); }
    }, 1050);
    return () => window.clearInterval(timer);
  }, [running]);

  const reset = () => { setPhase(0); setSelected(0); setRunning(false); setApproved(false); };
  const artifact = evidence[selected];

  const downloadPacket = () => {
    if (!approved) return;
    const packet = {
      schema: "shipproof.release-packet.v1",
      mission: "Protect the login API",
      verdict: "APPROVED_FOR_RELEASE",
      confidence: 100,
      model: "GPT-5.6",
      agent: "Codex",
      evidence: evidence.map(({ id, type, title, meta }) => ({ id, type, title, result: "VERIFIED", meta })),
      gates: { contract: "PASS", build: "PASS", adversarial_qa: "PASS", human_approval: "APPROVED" },
      integrity: { algorithm: "SHA-256", status: "SEALED", demo: true },
    };
    const href = URL.createObjectURL(new Blob([JSON.stringify(packet, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = href; link.download = "shipproof-release-packet.json"; link.click();
    URL.revokeObjectURL(href);
  };

  return (
    <main className="shell">
      <header><a href="#top" className="brand"><b>S</b> ShipProof</a><p><i /> Codex verification workspace <span /> DEMO-001</p></header>
      <section className="hero" id="top">
        <div><small>ENGINEERING MISSION</small><h1>Protect the login API</h1><p>One requirement. Every decision, diff, and test connected.</p></div>
        <div className="confidence"><b>✓</b><span>Release confidence<strong>{confidence}%</strong></span></div>
        <button className="run" disabled={running} onClick={() => phase >= 3 ? reset() : setRunning(true)}>{running ? "● Verifying…" : phase >= 3 ? "↻ Run again" : "▶ Run verification"}</button>
      </section>
      <nav aria-label="Verification stages">{stages.map((stage, i) => <button key={stage} className={i <= phase ? "active" : ""} onClick={() => !running && setPhase(i)}><b>{i < phase ? "✓" : i + 1}</b>{stage}</button>)}</nav>

      <section className="workspace">
        <div className="canvas">
          <label><i /> LIVE PROOF GRAPH</label>
          <div className={`alert ${phase === 2 ? "show" : ""}`}><strong>Adversarial QA found a bypass</strong><span>Identity normalization missing · remediation generated</span></div>
          <div className="graph">
            {evidence.map((item, i) => <div className="node-wrap" key={item.id}>
              <button className={`node ${selected === i ? "selected" : ""} ${phase === 2 && i === 2 ? "risk" : ""}`} onClick={() => setSelected(i)}>
                <span className="icon">{["≣", "⌘", "△"][i]}</span><span className="check">{phase >= i + 1 || phase >= 3 ? "✓" : "·"}</span>
                <small>{item.type}</small><h2>{item.title}</h2><code>{item.id}</code><p>{item.body}</p><em>{item.meta}</em>
              </button>{i < 2 && <div className={`line ${phase > i ? "filled" : ""}`}><i /></div>}
            </div>)}
          </div>
          <div className={`chain ${phase === 2 ? "warn" : ""}`}>{phase >= 3 ? "✓ EVIDENCE CHAIN COMPLETE" : phase === 2 ? "! RISK ISOLATED · REMEDIATING" : "↻ VERIFICATION IN PROGRESS"}</div>
        </div>

        <aside>
          <div className="aside-head"><div><small>{artifact.type}</small><h2>{artifact.title}</h2></div><b className={phase === 2 && selected === 2 ? "risk-tag" : "ok-tag"}>{phase === 2 && selected === 2 ? "Risk" : "Verified"}</b></div>
          <code>{artifact.id}</code><p className="description">{artifact.body}</p>
          <section className="links"><h3>Evidence links <span>3</span></h3>{["Acceptance criteria", "Codex change set", "Adversarial suite"].map((x, i) => <button key={x} onClick={() => setSelected(i)}><b>{["REQ", "DIF", "TST"][i]}</b><span>{x}</span><i>{phase === 2 && i === 2 ? "!" : "✓"}</i></button>)}</section>
          <dl><div><dt>Actor</dt><dd>Codex · GPT-5.6</dd></div><div><dt>Repository</dt><dd>shipproof/sample-api</dd></div><div><dt>Policy</dt><dd>Human approval required</dd></div><div><dt>Integrity</dt><dd>SHA-256 sealed</dd></div></dl>
          <section className="gate"><strong>HUMAN CONTROL GATE</strong><button disabled={phase < 3 || approved} onClick={() => { setApproved(true); setPhase(4); }}>{approved ? "✓ Release approved" : "Approve release"}</button><small>{phase < 3 ? "Unlocks after evidence verification" : approved ? "Release packet ready" : "All automated gates passed"}</small></section>
        </aside>
      </section>
      <footer><div><i className={phase === 2 ? "bad" : "good"} /><b>{["Contract ready", "Codex patch created", "Bypass found", "All evidence verified", "Release packet sealed"][phase]}</b><span> · {phase >= 3 ? "8 checks passed · 0 unresolved risks" : "Proof run DEMO-001"}</span></div><div><button onClick={reset}>Reset demo</button><button disabled={!approved} onClick={downloadPacket}>Download release packet ↓</button></div></footer>
    </main>
  );
}
