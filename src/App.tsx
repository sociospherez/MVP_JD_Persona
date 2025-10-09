import React, { useMemo, useState } from "react";
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
import { Handshake, Database, BarChart3, ScrollText, Scale } from "lucide-react";

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

type StrengthIconKey = "Handshake" | "Database" | "BarChart3" | "ScrollText" | "Scale";
const STRENGTH_OPTIONS: { id: string; label: string; icon: StrengthIconKey }[] = [
  { id: "strategic_partnerships", label: "Strategic Partnerships", icon: "Handshake" },
  { id: "information_centralization", label: "Information Centralization", icon: "Database" },
  { id: "dashboards_reporting", label: "Dashboards & Reporting", icon: "BarChart3" },
  { id: "legislative_compliance", label: "Legislative Compliance", icon: "ScrollText" },
  { id: "process_automation", label: "Process Automation", icon: "BarChart3" },
  { id: "governance_risk", label: "Governance & Risk", icon: "Scale" },
];

const STEPS = [
  { key: "context", label: "Setting the Scene" },
  { key: "purpose", label: "Role Purpose" },
  { key: "persona", label: "Persona Attributes" },
  { key: "success", label: "Success Metrics" },
  { key: "summary", label: "Persona Card" },
] as const;

type RadarDatum = { axis: AxisLabel; Persona: number };

/** =========================
 *  UI Components
 *  ========================= */
const Stepper: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center flex-wrap gap-3 mb-6">
    {STEPS.map((s, idx) => {
      const active = idx === current;
      const done = idx < current;
      return (
        <div key={s.key} className="flex items-center">
          <div
            className={[
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
              done ? "bg-black text-white" : active ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700",
              "shadow-sm",
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

const Slider: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
}> = ({ label, value, onChange, min = 1, max = 5, step = 1, help }) => (
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

/** =========================
 *  Main App
 *  ========================= */
export default function App(): JSX.Element {
  const [step, setStep] = useState<number>(0);

  // Step 1 — Context
  const [orgName, setOrgName] = useState<string>("Sand Tech Holdings Ltd");
  const [stage, setStage] = useState<string>("Transformation");
  const [challenges, setChallenges] = useState<string>(
    "ERP stabilisation, integration gaps, governance vs delivery balance",
  );
  const [team, setTeam] = useState<string>(
    "PMO of 5; reports to Head of Technology; close with Finance/Operations/Vendors",
  );
  const [culture, setCulture] = useState<string>("Collaborative, fast-paced, pragmatic");
  const [priorities, setPriorities] = useState<string>(
    "Stabilise ERP, close integration gaps, restore reporting standards",
  );

  // Step 2 — Purpose
  const [title, setTitle] = useState<string>("ERP Transformation Manager");
  const [purpose, setPurpose] = useState<string>(
    "Align technology delivery with business outcomes and make ERP a single source of truth.",
  );
  const [scope, setScope] = useState<string>("Manager");
  const [decisionLevel, setDecisionLevel] = useState<string>("Hybrid");
  const [influence, setInfluence] = useState<string>("3–5 direct reports; multi-region influence with vendors");

  // Step 3 — Persona attributes
  const [scores, setScores] = useState<number[]>([...DEFAULT_SCORES]);
  const [weights, setWeights] = useState<number[]>([...DEFAULT_WEIGHTS]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);

  // Step 4 — Success metrics
  const [shortTerm, setShortTerm] = useState<string>(
    "ERP data stabilised; ownership model agreed; integration map documented with initial fixes.",
  );
  const [longTerm, setLongTerm] = useState<string>(
    "Cross-functional reporting live; improved adoption; reduced downtime and duplication.",
  );
  const [culturalImpact, setCulturalImpact] = useState<string>(
    "Establish calm, structured delivery rhythm; build trust via transparency.",
  );

  /** Derived data */
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

    const bullets = [
      topAxes.length ? `Proven strength across ${topAxes.join(", ")}.` : null,
      `Operates at ${decisionLevel} level with ${scope} scope; translates strategy into execution.`,
      team ? `Collaborates effectively across ${team}.` : null,
      culture ? `Thrives in a ${culture.toLowerCase()} environment.` : null,
      priorities ? `Motivated by priorities such as: ${priorities}.` : null,
      strengths.length ? `Brings additional strengths in ${strengths.join(", ")}.` : null,
      shortTerm ? `90-day focus: ${shortTerm}` : null,
    ].filter(Boolean) as string[];

    return bullets;
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
      scoring: {
        method: "weighted_normalized_sum",
        fit: fitScore,
      },
      derived: {
        ideal_candidate: idealBullets,
      },
    }),
    [
      title,
      orgName,
      stage,
      challenges,
      team,
      culture,
      priorities,
      scores,
      weights,
      shortTerm,
      longTerm,
      culturalImpact,
      fitScore,
      selectedStrengths,
      idealBullets,
    ],
  );

  /** Nav */
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  /** Download persona JSON */
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_persona.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /** Icon mapper */
  const IconMap: Record<StrengthIconKey, React.ComponentType<{ className?: string }>> = {
    Handshake,
    Database,
    BarChart3,
    ScrollText,
    Scale,
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
        <p className="text-gray-600 mb-6">
          Persona-first → JD-second. Capture context, shape the persona, and generate an Ideal Candidate profile & JD.
        </p>

        <Stepper current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
              {/* Step 0 — Context */}
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Setting the Scene</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Organisation / Department</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Stage</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                      >
                        {["Start-up", "Growth", "Transformation", "Stabilisation", "Mature"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Key Challenges</label>
                      <textarea
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        rows={2}
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Team Structure</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Culture</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={culture}
                        onChange={(e) => setCulture(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priorities (3–6 months)</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={priorities}
                        onChange={(e) => setPriorities(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 — Purpose */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Role Purpose & Scope</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Role Title</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Scope Level</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                      >
                        {["Individual Contributor", "Manager", "Head", "Director"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Primary Purpose (1 sentence)</label>
                      <textarea
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        rows={2}
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Decision Level</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={decisionLevel}
                        onChange={(e) => setDecisionLevel(e.target.value)}
                      >
                        {["Strategic", "Tactical", "Operational", "Hybrid"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Influence / Span</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={influence}
                        onChange={(e) => setInfluence(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 — Persona Attributes */}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Persona Attributes</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Rate the expected level for the <em>ideal persona</em> (1 = basic, 5 = expert). Adjust weights if
                    certain axes matter more.
                  </p>

                  {AXES.map((axis, i) => (
                    <Slider
                      key={axis}
                      label={axis}
                      value={scores[i]}
                      onChange={(v) => setScores((prev) => prev.map((p, idx) => (idx === i ? v : p)))}
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
                            step={0.01}
                            min={0}
                            max={1}
                            value={weights[i]}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setWeights((prev) => prev.map((w, idx) => (idx === i ? val : w)));
                            }}
                            className="w-24 rounded-lg border border-gray-300 p-1"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Tip: weights should sum to ~1.00. Current total:{" "}
                      <strong>{weights.reduce((a, b) => a + b, 0).toFixed(2)}</strong>
                    </p>
                  </details>

                  <div className="mt-6">
                    <h3 className="text-base font-semibold mb-2">Select Additional Strengths (max 4)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {STRENGTH_OPTIONS.map((opt) => {
                        const selected = selectedStrengths.includes(opt.id);
                        const Icon = IconMap[opt.icon] ?? BarChart3;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setSelectedStrengths((prev) => {
                                if (prev.includes(opt.id)) return prev.filter((id) => id !== opt.id);
                                if (prev.length >= 4) return prev; // enforce limit
                                return [...prev, opt.id];
                              })
                            }
                            className={`flex items-center gap-2 p-3 rounded-xl border ${
                              selected ? "border-black bg-gray-100" : "border-gray-300"
                            } text-left`}
                            aria-pressed={selected}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Tip: choose differentiators that complement the core competencies above.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3 — Success Metrics */}
              {step === 3 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Success Metrics</h2>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">90-Day Success</label>
                      <textarea
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        rows={2}
                        value={shortTerm}
                        onChange={(e) => setShortTerm(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">12–18 Month Outcomes</label>
                      <textarea
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        rows={2}
                        value={longTerm}
                        onChange={(e) => setLongTerm(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cultural Impact</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-gray-300 p-2"
                        value={culturalImpact}
                        onChange={(e) => setCulturalImpact(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 — Persona Card (Radar, Ideal Candidate, JD) */}
              {step === 4 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Persona Card</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    This radar represents the <strong>ideal persona</strong> targets you set. Use it to inform JD and
                    shortlisting.
                  </p>
                  <div className="text-center mb-2">
                    <div className="text-sm tracking-wider font-bold text-gray-800">CORE COMPETENCIES</div>
                  </div>
                  <div className="w-full h-80 bg-white rounded-xl shadow-inner p-3 border border-gray-200">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#d6d3d1" />
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={45} domain={[0, 5]} tick={{ fontSize: 10 }} stroke="#e7e5e4" />
                        <Radar name="Persona" dataKey="Persona" stroke="#1f2937" fill="#111827" fillOpacity={0.18} dot />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Additional Strengths */}
                  <div className="mt-5">
                    <div className="text-center mb-2">
                      <div className="text-sm tracking-wider font-bold text-gray-800">ADDITIONAL STRENGTHS</div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedStrengths.length === 0 && (
                        <div className="col-span-2 sm:col-span-4 text-center text-sm text-gray-500">
                          No strengths selected yet.
                        </div>
                      )}
                      {selectedStrengths.map((id) => {
                        const opt = STRENGTH_OPTIONS.find((o) => o.id === id);
                        if (!opt) return null;
                        const Icon = IconMap[opt.icon] ?? BarChart3;
                        return (
                          <div key={id} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-white">
                            <Icon className="w-6 h-6 mb-2" />
                            <div className="text-xs text-center font-medium">{opt.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fit + Meta */}
                  <div className="mt-4 grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <div className="text-xs text-gray-500">Persona Fit</div>
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

                  {/* Ideal Candidate Profile */}
                  <div className="mt-4 p-4 rounded-xl bg-white border border-gray-200 text-sm">
                    <div className="font-semibold mb-2">Ideal Candidate Profile</div>
                    {idealBullets.length === 0 ? (
                      <div className="text-gray-500">Adjust the persona sliders and context to generate a profile.</div>
                    ) : (
                      <ul className="list-disc pl-5 space-y-1">
                        {idealBullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex items-center justify-end mt-3">
                      <button
                        onClick={async () => {
                          const text = `Ideal Candidate for ${title} (at ${orgName})\n\n- ${idealBullets.join(
                            "\n- ",
                          )}`;
                          try {
                            await navigator.clipboard.writeText(text);
                          } catch (err) {
                            console.error("Copy failed", err);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                      >
                        Copy Profile
                      </button>
                    </div>
                  </div>

                  {/* JD Draft Generator */}
                  <div className="mt-5 p-4 rounded-xl bg-white border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm tracking-wider font-bold text-gray-800">JD DRAFT</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const topAxes = [...scores]
                              .map((s, i) => ({ axis: AXES[i], score: s }))
                              .sort((a, b) => b.score - a.score)
                              .slice(0, 3)
                              .map((x) => x.axis);
                            const strengths = selectedStrengths
                              .map((id) => STRENGTH_OPTIONS.find((o) => o.id === id)?.label)
                              .filter(Boolean)
                              .join(", ");
                            const jd = `Role: ${title}
Organisation: ${orgName}
Stage: ${stage}

Purpose:
${purpose}

Top Competencies:
- ${topAxes.join("\n- ")}

Ideal Candidate:
- ${idealBullets.join("\n- ")}

Key Outcomes (90 days):
- ${shortTerm}

12–18 Month Outcomes:
- ${longTerm}

Culture & Ways of Working:
- ${culturalImpact}

Additional Strengths:
- ${strengths || "As relevant"}

Requirements:
- Demonstrable track record across the core competencies above.
- Ability to operate at ${decisionLevel} level with ${scope} scope.

Keywords:
${AXES.join(", ")}`;
                            const el = document.getElementById("jd-draft") as HTMLTextAreaElement | null;
                            if (el) el.value = jd;
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                        >
                          Generate JD Draft
                        </button>
                        <button
                          onClick={async () => {
                            const el = document.getElementById("jd-draft") as HTMLTextAreaElement | null;
                            if (el && el.value) {
                              try {
                                await navigator.clipboard.writeText(el.value);
                              } catch (err) {
                                console.error("Copy failed", err);
                              }
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="jd-draft"
                      rows={8}
                      className="w-full rounded-xl border border-gray-300 p-2 text-sm"
                      placeholder="Click 'Generate JD Draft' to populate..."
                    />
                  </div>

                  <div className="flex items-center justify-end mt-4">
                    <button onClick={downloadJSON} className="px-4 py-2 rounded-xl bg-black text-white shadow">
                      Download Persona JSON
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between mt-4">
              <button onClick={back} disabled={step === 0} className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-40">
                Back
              </button>
              <button
                onClick={next}
                disabled={step === STEPS.length - 1}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-40"
              >
                {step === STEPS.length - 1 ? "Done" : "Next"}
              </button>
            </div>
          </div>

          {/* Right rail — live preview / checklist */}
          <aside className="bg-white border border-gray-200 rounded-2xl p-5 h-max sticky top-4">
            <h3 className="font-semibold mb-3">Live Checklist</h3>
            <ul className="text-sm space-y-2">
              <li>• Context set: <strong>{orgName && stage ? "✓" : ""}</strong></li>
              <li>• Role purpose: <strong>{title && purpose ? "✓" : ""}</strong></li>
              <li>• Persona sliders: <strong>{scores.every((s) => s >= 1) ? "✓" : ""}</strong></li>
              <li>• Success metrics: <strong>{shortTerm && longTerm ? "✓" : ""}</strong></li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-gray-50 text-xs text-gray-600">
              Fit score responds live to persona sliders and weights.
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold">Raw JSON</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded-xl overflow-auto max-h-64">
                {JSON.stringify(jsonPayload, null, 2)}
              </pre>
            </details>
          </aside>
        </div>
      </div>
    </div>
  );
}
