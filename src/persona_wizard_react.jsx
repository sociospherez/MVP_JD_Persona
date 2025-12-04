import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

/**
 * Persona Wizard — "persona-first → JD-second" multi-step builder
 * - TailwindCSS styling
 * - Recharts radar for Persona Card
 * - Weighted fit scoring (0–100)
 * - Clean, modern UI with stepper + validation highlights
 *
 * All NPM libs are available in this canvas runtime per instructions.
 */

const AXES = [
  "Vision→Execution Balance",
  "Systems Depth",
  "Governance Orientation",
  "Stakeholder Influence",
  "Change Leadership",
  "Delivery Rigor",
  "Data Literacy",
  "Communication Clarity",
];

const DEFAULT_WEIGHTS = [0.12, 0.10, 0.14, 0.12, 0.12, 0.14, 0.13, 0.13];
const DEFAULT_SCORES = [4, 3, 5, 4, 4, 5, 4, 4];

const STEPS = [
  { key: "context", label: "Setting the Scene" },
  { key: "purpose", label: "Role Purpose" },
  { key: "persona", label: "Persona Attributes" },
  { key: "success", label: "Success Metrics" },
  { key: "summary", label: "Persona Card" },
];

const Stepper = ({ current }) => (
  <div className="flex items-center gap-3 mb-6">
    {STEPS.map((s, idx) => {
      const active = idx === current;
      const done = idx < current;
      return (
        <div key={s.key} className="flex items-center">
          <div
            className={[
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
              done ? "bg-black text-white" : active ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700",
              "shadow-sm"
            ].join(" ")}
            aria-current={active ? "step" : undefined}
          >
            {idx + 1}
          </div>
          <div className="ml-2 mr-4 text-sm sm:text-base font-medium text-gray-800">{s.label}</div>
          {idx !== STEPS.length - 1 && <div className="w-8 h-[2px] bg-gray-200 mr-4" />}
        </div>
      );
    })}
  </div>
);

function Slider({ label, min = 1, max = 5, step = 1, value, onChange, help }) {
  return (
    <div className="mb-5">
      
      <div className="flex items-center justify-between mb-1">
        <label className="font-medium text-gray-800">{label}</label>
        <span className="text-sm text-gray-600">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-black"
        aria-label={label}
      />
      {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
    </div>
  );
}

export default function PersonaWizard() {
  const [step, setStep] = useState(0);

  // Step 1 — Context
  const [orgName, setOrgName] = useState("Sand Tech Holdings Ltd");
  const [stage, setStage] = useState("Transformation");
  const [challenges, setChallenges] = useState("ERP stabilisation, integration gaps, governance vs delivery balance");
  const [team, setTeam] = useState("PMO of 5; reports to Head of Technology; close with Finance/Operations/Vendors");
  const [culture, setCulture] = useState("Collaborative, fast-paced, pragmatic");
  const [priorities, setPriorities] = useState("Stabilise ERP, close integration gaps, restore reporting standards");

  // Step 2 — Purpose
  const [title, setTitle] = useState("ERP Transformation Manager");
  const [purpose, setPurpose] = useState("Align technology delivery with business outcomes and make ERP a single source of truth.");
  const [scope, setScope] = useState("Manager");
  const [decisionLevel, setDecisionLevel] = useState("Hybrid");
  const [influence, setInfluence] = useState("3–5 direct reports; multi-region influence with vendors");

  // Step 3 — Persona attributes (sliders)
  const [scores, setScores] = useState([...DEFAULT_SCORES]);
  const [weights, setWeights] = useState([...DEFAULT_WEIGHTS]);

  // Step 4 — Success metrics
  const [shortTerm, setShortTerm] = useState("ERP data stabilised; ownership model agreed; integration map documented with initial fixes.");
  const [longTerm, setLongTerm] = useState("Cross-functional reporting live; improved adoption; reduced downtime and duplication.");
  const [culturalImpact, setCulturalImpact] = useState("Establish calm, structured delivery rhythm; build trust via transparency.");

  const data = useMemo(() => {
    return AXES.map((axis, i) => ({ axis, Persona: scores[i] }));
  }, [scores]);

  const fitScore = useMemo(() => {
    const norm = scores.map((s) => s / 5);
    const value = norm.reduce((acc, s, i) => acc + s * weights[i], 0);
    return Math.round(value * 100);
  }, [scores, weights]);

  const jsonPayload = useMemo(() => ({
    role_title: title,
    organisation: orgName,
    context: {
      stage,
      challenges: challenges.split(",").map(s => s.trim()).filter(Boolean),
      team_structure: team,
      culture,
      priorities
    },
    persona: {
      axes: AXES,
      weights,
      persona_scores: scores,
      scale: { min: 1, max: 5 }
    },
    success: {
      short_term: shortTerm,
      long_term: longTerm,
      cultural_impact: culturalImpact
    },
    scoring: {
      method: "weighted_normalized_sum",
      fit: fitScore
    }
  }), [title, orgName, stage, challenges, team, culture, priorities, scores, weights, shortTerm, longTerm, culturalImpact, fitScore]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

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
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-5xl mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
        >
          Persona Builder — {title}
        </motion.h1>
        <p className="text-gray-600 mb-6">Persona-first → JD-second. Capture context, shape the persona, get a radar card and a fit score.</p>

        <Stepper current={step} />

        {/* Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Setting the Scene</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Organisation / Department</label>
                      <input className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={orgName} onChange={(e)=>setOrgName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Stage</label>
                      <select className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={stage} onChange={(e)=>setStage(e.target.value)}>
                        {['Start-up','Growth','Transformation','Stabilisation','Mature'].map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Key Challenges</label>
                      <textarea className="mt-1 w-full rounded-xl border border-gray-300 p-2" rows={2} value={challenges} onChange={(e)=>setChallenges(e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Team Structure</label>
                      <input className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={team} onChange={(e)=>setTeam(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Culture</label>
                      <input className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={culture} onChange={(e)=>setCulture(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priorities (3–6 months)</label>
                      <input className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={priorities} onChange={(e)=>setPriorities(e.target.value)} />
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
                      <input className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={title} onChange={(e)=>setTitle(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Scope Level</label>
                      <select className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={scope} onChange={(e)=>setScope(e.target.value)}>
                        {['Individual Contributor','Manager','Head','Director'].map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Primary Purpose (1 sentence)</label>
                      <textarea className="mt-1 w-full rounded-xl border border-gray-300 p-2" rows={2} value={purpose} onChange={(e)=>setPurpose(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Decision Level</label>
                      <select className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={decisionLevel} onChange={(e)=>setDecisionLevel(e.target.value)}>
                        {['Strategic','Tactical','Operational','Hybrid'].map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Influence / Span</label>
                      <input className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={influence} onChange={(e)=>setInfluence(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Persona Attributes</h2>
                  <p className="text-sm text-gray-600 mb-4">Rate the expected level for the <em>ideal persona</em> (1 = basic, 5 = expert). Adjust weights if certain axes matter more.</p>

                  {AXES.map((axis, i) => (
                    <Slider
                      key={axis}
                      label={axis}
                      value={scores[i]}
                      onChange={(v) => setScores(prev => prev.map((p, idx) => idx === i ? v : p))}
                      help="Set the target strength for this attribute"
                    />
                  ))}

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-gray-800">Weights (advanced)</summary>
                    <div className="grid sm:grid-cols-2 gap-3 mt-3">
                      {AXES.map((axis, i) => (
                        <div key={axis} className="flex items-center gap-2">
                          <label className="text-sm text-gray-700 w-48">{axis}</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={weights[i]}
                            onChange={(e)=>{
                              const val = Number(e.target.value);
                              setWeights(prev => prev.map((w, idx) => idx === i ? val : w));
                            }}
                            className="w-24 rounded-lg border border-gray-300 p-1"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Tip: weights should sum to ~1.00. Current total: <strong>{weights.reduce((a,b)=>a+b,0).toFixed(2)}</strong></p>
                  </details>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Success Metrics</h2>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">90-Day Success</label>
                      <textarea className="mt-1 w-full rounded-xl border border-gray-300 p-2" rows={2} value={shortTerm} onChange={(e)=>setShortTerm(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">12–18 Month Outcomes</label>
                      <textarea className="mt-1 w-full rounded-xl border border-gray-300 p-2" rows={2} value={longTerm} onChange={(e)=>setLongTerm(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cultural Impact</label>
                      <input className="mt-1 w-full rounded-xl border border-gray-300 p-2" value={culturalImpact} onChange={(e)=>setCulturalImpact(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Persona Card</h2>
                  <p className="text-sm text-gray-600 mb-4">This radar represents the <strong>ideal persona</strong> targets you set. Use it to compare candidates later.</p>
                  <div className="w-full h-72 bg-white rounded-xl shadow-inner p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={45} domain={[0, 5]} tick={{ fontSize: 10 }} />
                        <Radar name="Persona" dataKey="Persona" stroke="#000000" fill="#000000" fillOpacity={0.2} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <div className="text-xs text-gray-500">Fit Score</div>
                      <div className="text-2xl font-bold">{fitScore}</div>
                      <div className="text-xs text-gray-500">Weighted persona strength (0–100)</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <div className="text-xs text-gray-500">Role</div>
                      <div className="font-semibold">{title}</div>
                      <div className="text-xs text-gray-500">{orgName}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <div className="text-xs text-gray-500">Stage</div>
                      <div className="font-semibold">{stage}</div>
                      <div className="text-xs text-gray-500">Decision: {decisionLevel} • Scope: {scope}</div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-gray-100 text-sm">
                    <div className="font-semibold mb-1">Summary</div>
                    <p>
                      A grounded yet visionary {title} who translates strategy into delivery, stabilises complexity through governance and
                      collaboration, and builds trust via transparent execution.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={back}
                disabled={step === 0}
                className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-40"
              >
                Back
              </button>
              <div className="flex items-center gap-3">
                {step === 4 && (
                  <button onClick={downloadJSON} className="px-4 py-2 rounded-xl bg-black text-white shadow">
                    Download Persona JSON
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={step === STEPS.length - 1}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-40"
                >
                  {step === STEPS.length - 1 ? "Done" : "Next"}
                </button>
              </div>
            </div>
          </div>

          {/* Right rail — live preview / checklist */}
          <aside className="bg-white border border-gray-200 rounded-2xl p-5 h-max sticky top-4">
            <h3 className="font-semibold mb-3">Live Checklist</h3>
            <ul className="text-sm space-y-2">
              <li>• Context set: <strong>{orgName && stage ? "✓" : ""}</strong></li>
              <li>• Role purpose: <strong>{title && purpose ? "✓" : ""}</strong></li>
              <li>• Persona sliders: <strong>{scores.every(s=>s>=1) ? "✓" : ""}</strong></li>
              <li>• Success metrics: <strong>{shortTerm && longTerm ? "✓" : ""}</strong></li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-gray-50 text-xs text-gray-600">
              Fit score responds live to persona sliders and weights.
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold">Raw JSON</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded-xl overflow-auto max-h-64">{JSON.stringify(jsonPayload, null, 2)}</pre>
            </details>
          </aside>
        </div>
      </div>
    </div>
  );
}
