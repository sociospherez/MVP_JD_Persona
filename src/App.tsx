import React, { useMemo, useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

import Stepper from "./components/Stepper";
import Slider from "./components/Slider";
import WalkthroughOverlay from "./components/WalkthroughOverlay";
import ThemeToggle from "./components/ThemeToggle";

import { applyTheme, ThemeName } from "./theme/theme";
import { PRESETS } from "./data/personaPresets";

/** =========================
 *  Constants / Types
 *  ========================= */
type AxisLabel =
  | "Vision→Execution Balance"
  | "Systems Depth"
  | "Governance Orientation"
  | "Stakeholder Influence"
  | "Change Leadership"
  | "Delivery Rigor"
  | "Data Literacy"
  | "Communication Clarity";

const AXES: AxisLabel[] = [
  "Vision→Execution Balance",
  "Systems Depth",
  "Governance Orientation",
  "Stakeholder Influence",
  "Change Leadership",
  "Delivery Rigor",
  "Data Literacy",
  "Communication Clarity",
];

const DEFAULT_WEIGHTS: number[] = [0.12, 0.1, 0.14, 0.12, 0.12, 0.14, 0.13, 0.13];
const DEFAULT_SCORES: number[] = [4, 3, 5, 4, 4, 5, 4, 4];

const STEPS = [
  { key: "context", label: "Setting the Scene" },
  { key: "purpose", label: "Role Purpose" },
  { key: "persona", label: "Persona Attributes" },
  { key: "success", label: "Success Metrics" },
  { key: "summary", label: "Persona Card" },
] as const;

type RadarDatum = { axis: AxisLabel; Persona: number };

const STRENGTH_OPTIONS = [
  { id: "strategic_partnerships", label: "Strategic Partnerships", emoji: "🤝" },
  { id: "information_centralization", label: "Information Centralization", emoji: "🗄️" },
  { id: "dashboards_reporting", label: "Dashboards & Reporting", emoji: "📊" },
  { id: "legislative_compliance", label: "Legislative Compliance", emoji: "📜" },
  { id: "process_automation", label: "Process Automation", emoji: "⚙️" },
  { id: "governance_risk", label: "Governance & Risk", emoji: "⚖️" },
] as const;

/** =========================
 *  Main App
 *  ========================= */
export default function App(): JSX.Element {
  // Theme (CSS file swap)
  const [theme, setTheme] = useState<ThemeName>("dark");
  useEffect(() => applyTheme(theme), [theme]);

  // Walkthrough — always on by default (your requirement)
  const [showWalkthrough, setShowWalkthrough] = useState(true);

  // Stepper
  const [step, setStep] = useState<number>(0);
  const [maxReached, setMaxReached] = useState<number>(0);

  // Presets
  const [presetId, setPresetId] = useState<string>(PRESETS[0]?.id ?? "");

  // Step 0 — Context
  const [orgName, setOrgName] = useState<string>("Sand Tech Holdings Ltd");
  const [stage, setStage] = useState<string>("Transformation");
  const [challenges, setChallenges] = useState<string>("ERP stabilisation, integration gaps, governance vs delivery balance");
  const [team, setTeam] = useState<string>("PMO of 5; reports to Head of Technology; close with Finance/Operations/Vendors");
  const [culture, setCulture] = useState<string>("Collaborative, fast-paced, pragmatic");
  const [priorities, setPriorities] = useState<string>("Stabilise ERP, close integration gaps, restore reporting standards");

  // Step 1 — Purpose
  const [title, setTitle] = useState<string>("ERP Transformation Manager");
  const [purpose, setPurpose] = useState<string>("Align technology delivery with business outcomes and make ERP a single source of truth.");
  const [scope, setScope] = useState<string>("Manager");
  const [decisionLevel, setDecisionLevel] = useState<string>("Hybrid");

  // Step 2 — Persona
  const [scores, setScores] = useState<number[]>([...DEFAULT_SCORES]);
  const [weights, setWeights] = useState<number[]>([...DEFAULT_WEIGHTS]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);

  // Step 3 — Success
  const [shortTerm, setShortTerm] = useState<string>("ERP data stabilised; ownership model agreed; integration map documented with initial fixes.");
  const [longTerm, setLongTerm] = useState<string>("Cross-functional reporting live; improved adoption; reduced downtime and duplication.");
  const [culturalImpact, setCulturalImpact] = useState<string>("Establish calm, structured delivery rhythm; build trust via transparency.");

  // Apply preset
  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setTitle(p.title);
    setPurpose(p.purpose);
    setScope(p.scope);
    setDecisionLevel(p.decisionLevel);
    setStage(p.stage);
    setChallenges(p.challenges);
    setTeam(p.team);
    setCulture(p.culture);
    setPriorities(p.priorities);
    setScores([...p.axesScores]);
    setWeights([...p.axesWeights]);
    setSelectedStrengths([...p.strengths]);
  };

  useEffect(() => {
    if (presetId) applyPreset(presetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetId]);

  /** Derived */
  const data: RadarDatum[] = useMemo(
    () => AXES.map((axis, i) => ({ axis, Persona: scores[i] })),
    [scores],
  );

  const fitScore: number = useMemo(() => {
    const norm = scores.map((s) => s / 5);
    const value = norm.reduce((acc, s, i) => acc + s * (weights[i] ?? 0), 0);
    return Math.round(value * 100);
  }, [scores, weights]);

  const idealBullets: string[] = useMemo(() => {
    const topAxes = [...scores]
      .map((s, i) => ({ axis: AXES[i], score: s }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.axis);

    const strengths = selectedStrengths
      .map((id) => STRENGTH_OPTIONS.find((o) => o.id === id)?.label)
      .filter(Boolean);

    return [
      topAxes.length ? `Strong across ${topAxes.join(", ")}.` : null,
      `Operates at ${decisionLevel} level with ${scope} scope.`,
      team ? `Works effectively across: ${team}.` : null,
      culture ? `Fits a ${culture.toLowerCase()} environment.` : null,
      priorities ? `Focused on near-term priorities: ${priorities}.` : null,
      strengths.length ? `Differentiators: ${strengths.join(", ")}.` : null,
      shortTerm ? `90-day focus: ${shortTerm}` : null,
    ].filter(Boolean) as string[];
  }, [scores, selectedStrengths, decisionLevel, scope, team, culture, priorities, shortTerm]);

  const jsonPayload = useMemo(
    () => ({
      role_title: title,
      organisation: orgName,
      context: {
        stage,
        challenges: challenges.split(",").map((s) => s.trim()).filter(Boolean),
        team_structure: team,
        culture,
        priorities,
      },
      persona: {
        axes: AXES,
        weights,
        persona_scores: scores,
        scale: { min: 1, max: 5 },
        additional_strengths: selectedStrengths,
      },
      success: {
        short_term: shortTerm,
        long_term: longTerm,
        cultural_impact: culturalImpact,
      },
      scoring: { method: "weighted_normalized_sum", fit: fitScore },
      derived: { ideal_candidate: idealBullets },
    }),
    [title, orgName, stage, challenges, team, culture, priorities, scores, weights, selectedStrengths, shortTerm, longTerm, culturalImpact, fitScore, idealBullets],
  );

  /** Nav */
  const next = () => {
    setStep((s) => {
      const ns = Math.min(s + 1, STEPS.length - 1);
      setMaxReached((prev) => Math.max(prev, ns));
      return ns;
    });
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const handleStepClick = (index: number) => { if (index <= maxReached) setStep(index); };

  /** Download */
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_persona.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pw-shell">
      <WalkthroughOverlay
        open={showWalkthrough}
        onClose={() => setShowWalkthrough(false)}
        onStart={() => {
          setStep(0);
          setMaxReached(0);
        }}
      />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Persona Builder — {title}
            </motion.h1>
            <p className="pw-muted mt-1">
              Persona-first → JD-second. Shape the ideal candidate, then generate outputs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="pw-select rounded-xl px-3 py-2 text-xs"
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              aria-label="Load persona preset"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>

            <ThemeToggle
              theme={theme}
              onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            />

            <button
              type="button"
              onClick={() => setShowWalkthrough(true)}
              className="pw-btn px-3 py-1.5 rounded-full text-xs"
            >
              Walkthrough
            </button>
          </div>
        </div>

        <Stepper
          steps={[...STEPS]}
          current={step}
          maxAllowed={maxReached}
          onStepClick={handleStepClick}
        />

        {/* ✅ Two-column layout restored */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="pw-card rounded-2xl p-5">
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Setting the Scene</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Organisation / Department</label>
                      <input className="pw-input mt-1 w-full rounded-xl p-2" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Stage</label>
                      <select className="pw-select mt-1 w-full rounded-xl p-2" value={stage} onChange={(e) => setStage(e.target.value)}>
                        {["Start-up", "Growth", "Transformation", "Stabilisation", "Mature"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Key Challenges</label>
                      <textarea className="pw-textarea mt-1 w-full rounded-xl p-2" rows={2} value={challenges} onChange={(e) => setChallenges(e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Team Structure</label>
                      <input className="pw-input mt-1 w-full rounded-xl p-2" value={team} onChange={(e) => setTeam(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Culture</label>
                      <input className="pw-input mt-1 w-full rounded-xl p-2" value={culture} onChange={(e) => setCulture(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priorities (3–6 months)</label>
                      <input className="pw-input mt-1 w-full rounded-xl p-2" value={priorities} onChange={(e) => setPriorities(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Role Purpose & Scope</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Role Title</label>
                      <input className="pw-input mt-1 w-full rounded-xl p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Scope Level</label>
                      <select className="pw-select mt-1 w-full rounded-xl p-2" value={scope} onChange={(e) => setScope(e.target.value)}>
                        {["Individual Contributor", "Manager", "Head", "Director"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Primary Purpose (1 sentence)</label>
                      <textarea className="pw-textarea mt-1 w-full rounded-xl p-2" rows={2} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Decision Level</label>
                      <select className="pw-select mt-1 w-full rounded-xl p-2" value={decisionLevel} onChange={(e) => setDecisionLevel(e.target.value)}>
                        {["Strategic", "Tactical", "Operational", "Hybrid"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Persona Attributes</h2>
                  <p className="text-sm pw-muted mb-4">
                    Rate the expected level for the <em>ideal persona</em> (1–5). Weights optional.
                  </p>

                  {AXES.map((axis, i) => (
                    <Slider
                      key={axis}
                      label={axis}
                      value={scores[i]}
                      onChange={(v) => setScores((prev) => prev.map((p, idx) => (idx === i ? v : p)))}
                      help="Target strength"
                    />
                  ))}

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold">Weights (advanced)</summary>
                    <div className="grid sm:grid-cols-2 gap-3 mt-3">
                      {AXES.map((axis, i) => (
                        <div key={axis} className="flex items-center gap-2">
                          <label className="text-sm w-48 pw-muted">{axis}</label>
                          <input
                            type="number"
                            step={0.01}
                            min={0}
                            max={1}
                            value={weights[i]}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setWeights((prev) => prev.map((w, idx) => (idx === i ? val : w)));
                            }}
                            className="pw-input w-24 rounded-lg p-1"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs pw-muted mt-2">
                      Total: <strong>{weights.reduce((a, b) => a + b, 0).toFixed(2)}</strong>
                    </p>
                  </details>

                  <div className="mt-6">
                    <h3 className="text-base font-semibold mb-2">Additional Strengths (max 4)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {STRENGTH_OPTIONS.map((opt) => {
                        const selected = selectedStrengths.includes(opt.id);
                        return (
                          <motion.button
                            key={opt.id}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() =>
                              setSelectedStrengths((prev) => {
                                if (prev.includes(opt.id)) return prev.filter((id) => id !== opt.id);
                                if (prev.length >= 4) return prev;
                                return [...prev, opt.id];
                              })
                            }
                            className={`pw-btn rounded-xl p-3 text-left flex items-center gap-2 ${
                              selected ? "ring-2 ring-white/20" : ""
                            }`}
                          >
                            <div className="text-xl">{opt.emoji}</div>
                            <span className="text-sm">{opt.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Success Metrics</h2>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">90-Day Success</label>
                      <textarea className="pw-textarea mt-1 w-full rounded-xl p-2" rows={2} value={shortTerm} onChange={(e) => setShortTerm(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">12–18 Month Outcomes</label>
                      <textarea className="pw-textarea mt-1 w-full rounded-xl p-2" rows={2} value={longTerm} onChange={(e) => setLongTerm(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cultural Impact</label>
                      <input className="pw-input mt-1 w-full rounded-xl p-2" value={culturalImpact} onChange={(e) => setCulturalImpact(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Persona Card</h2>
                  <p className="text-sm pw-muted mb-4">
                    Radar represents the ideal persona targets. Use it to inform JD + shortlist.
                  </p>

                  <div className="w-full h-80 pw-card rounded-xl p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={45} domain={[0, 5]} tick={{ fontSize: 10 }} />
                        <Radar name="Persona" dataKey="Persona" stroke="#ffffff" fill="#ffffff" fillOpacity={0.15} dot />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-3 gap-3">
                    <div className="pw-card rounded-xl p-4">
                      <div className="text-xs pw-muted">Persona Fit</div>
                      <div className="text-2xl font-bold">{fitScore}</div>
                      <div className="text-xs pw-muted">Weighted strength (0–100)</div>
                    </div>
                    <div className="pw-card rounded-xl p-4">
                      <div className="text-xs pw-muted">Role</div>
                      <div className="font-semibold">{title}</div>
                      <div className="text-xs pw-muted">{orgName}</div>
                    </div>
                    <div className="pw-card rounded-xl p-4">
                      <div className="text-xs pw-muted">Stage</div>
                      <div className="font-semibold">{stage}</div>
                      <div className="text-xs pw-muted">Decision: {decisionLevel} • Scope: {scope}</div>
                    </div>
                  </div>

                  <div className="mt-4 pw-card rounded-xl p-4 text-sm">
                    <div className="font-semibold mb-2">Ideal Candidate Profile</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {idealBullets.map((b, i) => <li key={i} className="pw-muted">{b}</li>)}
                    </ul>

                    <div className="flex items-center justify-end mt-3">
                      <button
                        className="pw-btn px-3 py-1.5 rounded-lg text-xs"
                        onClick={async () => {
                          const text = `Ideal Candidate for ${title} (at ${orgName})\n\n- ${idealBullets.join("\n- ")}`;
                          await navigator.clipboard.writeText(text);
                        }}
                      >
                        Copy Profile
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-4">
                    <button onClick={downloadJSON} className="pw-btn-primary px-4 py-2 rounded-xl text-sm">
                      Download Persona JSON
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <button onClick={back} disabled={step === 0} className="pw-btn px-4 py-2 rounded-xl disabled:opacity-40">
                Back
              </button>
              <button
                onClick={next}
                disabled={step === STEPS.length - 1}
                className="pw-btn-primary px-4 py-2 rounded-xl disabled:opacity-40"
              >
                {step === STEPS.length - 1 ? "Done" : "Next"}
              </button>
            </div>
          </div>

          {/* ✅ Right rail back */}
          <aside className="pw-aside rounded-2xl p-5 h-max sticky top-6">
            <h3 className="font-semibold mb-3">Live Checklist</h3>
            <ul className="text-sm space-y-2">
              <li>• Context set: <strong>{orgName && stage ? "✓" : ""}</strong></li>
              <li>• Role purpose: <strong>{title && purpose ? "✓" : ""}</strong></li>
              <li>• Persona sliders: <strong>{scores.every((s) => s >= 1) ? "✓" : ""}</strong></li>
              <li>• Success metrics: <strong>{shortTerm && longTerm ? "✓" : ""}</strong></li>
            </ul>

            <div className="mt-4 p-3 rounded-xl pw-card text-xs">
              <span className="pw-muted">Fit score responds live to persona sliders and weights.</span>
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold">
                Raw JSON <span className="text-xs font-normal pw-muted">(for storage / integration)</span>
              </summary>
              <pre className="mt-2 text-xs pw-card p-2 rounded-xl overflow-auto max-h-64">
                {JSON.stringify(jsonPayload, null, 2)}
              </pre>
            </details>
          </aside>
        </div>
      </div>
    </div>
  );
}
