import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Handshake,
  Database,
  BarChart3,
  ScrollText,
  Scale,
  Sun,
  Moon,
} from "lucide-react";

/* ----------------------------------------------------------
CONSTANTS
---------------------------------------------------------- */

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

const DEFAULT_WEIGHTS = [0.12, 0.1, 0.14, 0.12, 0.12, 0.14, 0.13, 0.13];
const DEFAULT_SCORES = [4, 3, 5, 4, 4, 5, 4, 4];

const STRENGTH_OPTIONS = [
  { id: "strategic_partnerships", label: "Strategic Partnerships", emoji: "🤝" },
  { id: "information_centralization", label: "Information Centralization", emoji: "🗄️" },
  { id: "dashboards_reporting", label: "Dashboards & Reporting", emoji: "📊" },
  { id: "legislative_compliance", label: "Legislative Compliance", emoji: "📜" },
  { id: "process_automation", label: "Process Automation", emoji: "⚙️" },
  { id: "governance_risk", label: "Governance & Risk", emoji: "⚖️" },
];

const STEPS = [
  { key: "context", label: "Setting the Scene" },
  { key: "purpose", label: "Role Purpose" },
  { key: "persona", label: "Persona Attributes" },
  { key: "success", label: "Success Metrics" },
  { key: "summary", label: "Persona Card" },
];

/* ----------------------------------------------------------
WALKTHROUGH OVERLAY
---------------------------------------------------------- */

const WalkthroughOverlay = ({
  onStart,
  onSkip,
}: {
  onStart: () => void;
  onSkip: () => void;
}) => {
  const [tourStep, setTourStep] = useState(0);

  const slides = [
    {
      title: "How this demo works",
      icon: "🧭",
      body: [
        "Pretend you’re the hiring manager describing the person you need.",
        "The wizard turns that into: a persona radar, a candidate profile, and a JD draft.",
        "Fields are pre-filled for demo purposes.",
      ],
    },
    {
      title: "What you will fill in",
      icon: "✍️",
      body: [
        "Org context, challenges, priorities, role purpose.",
        "Sliders define the behavioural 'shape' of the persona.",
        "Strength tiles highlight unique differentiators.",
      ],
    },
    {
      title: "What you get",
      icon: "📊",
      body: [
        "A visual persona card with radar.",
        "An ideal candidate bullet set.",
        "A generated JD you can copy & refine.",
      ],
    },
  ];

  const current = slides[tourStep];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        className="bg-white rounded-2xl p-6 max-w-xl w-full mx-4 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">{current.icon}</span>
            {current.title}
          </h2>
          <button onClick={onSkip} className="text-xs text-gray-500">
            Skip
          </button>
        </div>

        <ul className="text-sm text-gray-700 space-y-1 mb-5">
          {current.body.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>

        <div className="flex justify-between">
          <button
            className="px-3 py-1.5 rounded-lg border text-xs"
            disabled={tourStep === 0}
            onClick={() => setTourStep((t) => Math.max(0, t - 1))}
          >
            Back
          </button>

          <button
            className="px-3 py-1.5 rounded-lg bg-black text-white text-xs"
            onClick={() => {
              if (tourStep < slides.length - 1) {
                setTourStep((t) => t + 1);
              } else {
                onStart();
              }
            }}
          >
            {tourStep === slides.length - 1 ? "Start demo" : "Next"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ----------------------------------------------------------
MAIN APP
---------------------------------------------------------- */

export default function App() {
  /* Wizard State */
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);

  /* Walkthrough State */
  const [showWalkthrough, setShowWalkthrough] = useState(() => {
    return !localStorage.getItem("personaWizardSeen");
  });

  const finishWalkthrough = () => {
    localStorage.setItem("personaWizardSeen", "1");
    setShowWalkthrough(false);
  };

  /* THEME TOGGLE */
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);

    const el = document.getElementById("theme-css") as HTMLLinkElement;
    if (el) el.href = `/themes/${next}.css`;
  };

  /* FORM STATE */
  const [orgName, setOrgName] = useState("Sand Tech Holdings Ltd");
  const [stage, setStage] = useState("Transformation");
  const [challenges, setChallenges] = useState(
    "ERP stabilisation, integration gaps, governance vs delivery balance"
  );
  const [team, setTeam] = useState(
    "PMO of 5; reports to Head of Technology; close with Finance/Operations/Vendors"
  );
  const [culture, setCulture] = useState("Collaborative, fast-paced, pragmatic");
  const [priorities, setPriorities] = useState(
    "Stabilise ERP, close integration gaps, restore reporting standards"
  );

  const [title, setTitle] = useState("ERP Transformation Manager");
  const [purpose, setPurpose] = useState(
    "Align technology delivery with business outcomes."
  );
  const [scope, setScope] = useState("Manager");
  const [decisionLevel, setDecisionLevel] = useState("Hybrid");

  const [scores, setScores] = useState([...DEFAULT_SCORES]);
  const [weights, setWeights] = useState([...DEFAULT_WEIGHTS]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);

  const [shortTerm, setShortTerm] = useState(
    "ERP data stabilised; ownership model agreed."
  );
  const [longTerm, setLongTerm] = useState(
    "Cross-functional reporting live; reduced downtime."
  );
  const [culturalImpact, setCulturalImpact] = useState(
    "Build trust through transparent delivery rhythms."
  );

  /* Radar Data */
  const data = useMemo(
    () =>
      AXES.map((axis, i) => ({
        axis,
        Persona: scores[i],
      })),
    [scores]
  );

  const fitScore = useMemo(() => {
    const norm = scores.map((s) => s / 5);
    return Math.round(
      norm.reduce((acc, s, i) => acc + s * (weights[i] ?? 0), 0) * 100
    );
  }, [scores, weights]);

  /* IDEAL CANDIDATE */
  const idealBullets = useMemo(() => {
    const top = [...scores]
      .map((s, i) => ({ axis: AXES[i], score: s }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.axis);

    const strengths = selectedStrengths
      .map((id) => STRENGTH_OPTIONS.find((o) => o.id === id)?.label)
      .filter(Boolean);

    return [
      top.length ? `Strength in ${top.join(", ")}.` : null,
      `Operates at ${decisionLevel} level with ${scope} scope.`,
      culture ? `Thrives in a ${culture.toLowerCase()} environment.` : null,
      priorities ? `Motivated by: ${priorities}.` : null,
      strengths.length ? `Additional strengths: ${strengths.join(", ")}.` : null,
    ].filter(Boolean) as string[];
  }, [
    scores,
    selectedStrengths,
    decisionLevel,
    scope,
    culture,
    priorities,
  ]);

  /* Step Navigation */
  const next = () => {
    setStep((s) => {
      const next = Math.min(s + 1, STEPS.length - 1);
      setMaxReached((m) => Math.max(m, next));
      return next;
    });
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  /* ----------------------------------------------------------
  RENDER
  ---------------------------------------------------------- */

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{ background: "var(--bg-body)", color: "var(--text-main)" }}
    >
      {showWalkthrough && (
        <AnimatePresence>
          <WalkthroughOverlay
            onStart={finishWalkthrough}
            onSkip={finishWalkthrough}
          />
        </AnimatePresence>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Persona Builder — {title}
        </h1>

        {/* THEME TOGGLE — stays where it was */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-full border flex items-center gap-2"
          style={{
            background: "var(--bg-card)",
            color: "var(--text-main)",
            borderColor: "var(--border-soft)",
          }}
        >
          {theme === "light" ? (
            <>
              <Moon size={14} />
              Dark
            </>
          ) : (
            <>
              <Sun size={14} />
              Light
            </>
          )}
        </button>
      </div>

      {/* STEP-BY-STEP HEADER */}
      <div className="flex gap-4 mb-8">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          const enabled = i <= maxReached;

          return (
            <button
              key={s.key}
              disabled={!enabled}
              onClick={() => enabled && setStep(i)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                active
                  ? "bg-black text-white"
                  : done
                  ? "bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {i + 1}. {s.label}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            {step === 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Setting the Scene</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label>Organisation / Department</label>
                    <input
                      className="input w-full p-2 rounded-xl"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Stage</label>
                    <select
                      className="input w-full p-2 rounded-xl"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                    >
                      {[
                        "Start-up",
                        "Growth",
                        "Transformation",
                        "Stabilisation",
                        "Mature",
                      ].map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label>Key Challenges</label>
                    <textarea
                      className="input w-full p-2 rounded-xl"
                      rows={2}
                      value={challenges}
                      onChange={(e) => setChallenges(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label>Team Structure</label>
                    <input
                      className="input w-full p-2 rounded-xl"
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Culture</label>
                    <input
                      className="input w-full p-2 rounded-xl"
                      value={culture}
                      onChange={(e) => setCulture(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Priorities (3–6 months)</label>
                    <input
                      className="input w-full p-2 rounded-xl"
                      value={priorities}
                      onChange={(e) => setPriorities(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Role Purpose & Scope
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label>Role Title</label>
                    <input
                      className="input w-full p-2 rounded-xl"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Scope</label>
                    <select
                      className="input w-full p-2 rounded-xl"
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                    >
                      {[
                        "Individual Contributor",
                        "Manager",
                        "Head",
                        "Director",
                      ].map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label>Purpose</label>
                    <textarea
                      rows={2}
                      className="input w-full p-2 rounded-xl"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Decision Level</label>
                    <select
                      className="input w-full p-2 rounded-xl"
                      value={decisionLevel}
                      onChange={(e) => setDecisionLevel(e.target.value)}
                    >
                      {["Strategic", "Tactical", "Operational", "Hybrid"].map(
                        (opt) => (
                          <option key={opt}>{opt}</option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Persona Attributes
                </h2>

                {AXES.map((axis, i) => (
                  <div key={axis} className="mb-4">
                    <label className="text-sm font-medium">{axis}</label>

                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={scores[i]}
                      onChange={(e) =>
                        setScores((prev) =>
                          prev.map((p, idx) =>
                            idx === i ? Number(e.target.value) : p
                          )
                        )
                      }
                      className="w-full"
                    />
                  </div>
                ))}

                <h3 className="font-semibold mt-6 mb-2">
                  Additional Strengths (max 4)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {STRENGTH_OPTIONS.map((opt) => {
                    const selected = selectedStrengths.includes(opt.id);

                    return (
                      <motion.button
                        key={opt.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setSelectedStrengths((prev) => {
                            if (prev.includes(opt.id))
                              return prev.filter((id) => id !== opt.id);
                            if (prev.length >= 4) return prev;
                            return [...prev, opt.id];
                          })
                        }
                        className={`p-3 rounded-xl border text-left ${
                          selected
                            ? "bg-blue-100 border-blue-400"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="text-xl mb-1">{opt.emoji}</div>
                        <div className="text-sm">{opt.label}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Success Metrics</h2>

                <div className="grid gap-4">
                  <div>
                    <label>90-Day Success</label>
                    <textarea
                      className="input w-full p-2 rounded-xl"
                      value={shortTerm}
                      onChange={(e) => setShortTerm(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>12–18 Month Outcomes</label>
                    <textarea
                      className="input w-full p-2 rounded-xl"
                      value={longTerm}
                      onChange={(e) => setLongTerm(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Cultural Impact</label>
                    <input
                      className="input w-full p-2 rounded-xl"
                      value={culturalImpact}
                      onChange={(e) => setCulturalImpact(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Persona Card */}
            {step === 4 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Persona Card</h2>

                <div className="card p-4 mb-5">
                  <div className="w-full h-64">
                    <ResponsiveContainer>
                      <RadarChart data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="axis" />
                        <PolarRadiusAxis angle={45} domain={[0, 5]} />
                        <Radar
                          name="Persona"
                          dataKey="Persona"
                          fill="#0f172a"
                          fillOpacity={0.3}
                          stroke="#0f172a"
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card p-4 mb-4">
                  <h3 className="font-semibold mb-2">Ideal Candidate</h3>

                  <ul className="text-sm space-y-1">
                    {idealBullets.map((b, i) => (
                      <li key={i}>• {b}</li>
                    ))}
                  </ul>
                </div>

                <div className="card p-4">
                  <h3 className="font-semibold mb-2">JD Draft</h3>
                  <textarea
                    className="input w-full p-2 rounded-xl text-sm"
                    rows={8}
                    defaultValue=""
                    id="jd-draft"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="flex justify-between mt-4">
            <button
              onClick={back}
              disabled={step === 0}
              className="px-4 py-2 rounded-xl border"
            >
              Back
            </button>

            <button
              onClick={next}
              disabled={step === STEPS.length - 1}
              className="px-4 py-2 rounded-xl bg-black text-white"
            >
              {step === STEPS.length - 1 ? "Done" : "Next"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside className="card p-4 h-max sticky top-4">
          <h3 className="font-semibold mb-3">Checklist</h3>
          <ul className="text-sm space-y-2">
            <li>• Context ✓</li>
            <li>• Role purpose ✓</li>
            <li>• Persona sliders ✓</li>
            <li>• Success metrics ✓</li>
          </ul>

          <details className="mt-4">
            <summary className="cursor-pointer">Raw JSON</summary>
            <pre className="text-[11px] bg-gray-100 p-2 rounded-xl max-h-64 overflow-auto">
              {JSON.stringify(
                {
                  role_title: title,
                  organisation: orgName,
                  context: {
                    challenges,
                    team,
                    culture,
                    priorities,
                  },
                  persona: {
                    scores,
                    weights,
                    selectedStrengths,
                  },
                  success: {
                    shortTerm,
                    longTerm,
                    culturalImpact,
                  },
                  derived: {
                    idealBullets,
                    fitScore,
                  },
                },
                null,
                2
              )}
            </pre>
          </details>
        </aside>
      </div>
    </div>
  );
}
