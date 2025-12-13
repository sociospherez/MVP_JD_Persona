import React, { JSX, useEffect, useMemo, useState } from "react";
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
import { Handshake, Database, BarChart3, ScrollText, Scale, Sun, Moon } from "lucide-react";

/* ============================
   Types / Constants
   ============================ */

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

const STRENGTH_OPTIONS = [
  { id: "strategic_partnerships", label: "Strategic Partnerships", emoji: "🤝" },
  { id: "information_centralization", label: "Information Centralization", emoji: "🗄️" },
  { id: "dashboards_reporting", label: "Dashboards & Reporting", emoji: "📊" },
  { id: "legislative_compliance", label: "Legislative Compliance", emoji: "📜" },
  { id: "process_automation", label: "Process Automation", emoji: "⚙️" },
  { id: "governance_risk", label: "Governance & Risk", emoji: "⚖️" },
] as const;

const STEPS = [
  { key: "context", label: "Setting the Scene" },
  { key: "purpose", label: "Role Purpose" },
  { key: "persona", label: "Persona Attributes" },
  { key: "success", label: "Success Metrics" },
  { key: "summary", label: "Persona Card" },
] as const;

type RadarDatum = { axis: AxisLabel; Persona: number };

/* ============================
   Small UI pieces
   ============================ */

interface StepperProps {
  current: number;
  maxAllowed: number;
  onStepClick?: (index: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ current, maxAllowed, onStepClick }) => (
  <div className="flex items-center flex-wrap gap-3 mb-6">
    {STEPS.map((s, idx) => {
      const active = idx === current;
      const done = idx < current;
      const clickable = idx <= maxAllowed;

      const baseCircle =
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm";
      const circleClass = done
        ? "bg-black text-white"
        : active
        ? "bg-slate-900 text-white"
        : "bg-slate-200 text-slate-700";

      return (
        <div key={s.key} className="flex items-center">
          {clickable && onStepClick ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onStepClick(idx)}
              className={`${baseCircle} ${circleClass} focus:outline-none focus:ring-2 focus:ring-violet-400`}
              aria-current={active ? "step" : undefined}
            >
              {idx + 1}
            </motion.button>
          ) : (
            <div className={`${baseCircle} ${circleClass}`} aria-current={active ? "step" : undefined}>
              {idx + 1}
            </div>
          )}
          <div className="ml-2 mr-4 text-sm sm:text-base font-medium text-slate-100">{s.label}</div>
          {idx !== STEPS.length - 1 && <div className="w-8 h-[2px] bg-slate-600/40 mr-4" />}
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
      <label className="font-medium text-slate-50">{label}</label>
      <span className="text-sm text-slate-300">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-violet-300"
      aria-label={label}
    />
    {help && <p className="text-xs text-slate-300 mt-1">{help}</p>}
  </div>
);

/* ============================
   Walkthrough Overlay
   ============================ */

const WalkthroughOverlay: React.FC<{
  onStart: () => void;
  onSkip: () => void;
}> = ({ onStart, onSkip }) => {
  const [tourStep, setTourStep] = useState(0);

  const slides = [
    {
      title: "How this demo works",
      icon: "🧭",
      body: [
        "Pretend you’re the hiring manager describing the kind of person you need.",
        "The wizard turns that into a persona radar, an ideal candidate profile, and a draft JD.",
        "Fields are pre-filled so you can see a complete example; in real use you’d overwrite them.",
      ],
      layout: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50/5 border border-slate-700/60">
            <div className="font-semibold mb-1 text-slate-100 text-[11px]">1 — Context</div>
            <p className="text-slate-200/90">Org, stage, challenges, team, culture, near-term priorities.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50/5 border border-slate-700/60">
            <div className="font-semibold mb-1 text-slate-100 text-[11px]">2 — Persona</div>
            <p className="text-slate-200/90">Sliders + strengths shape the “ideal candidate” radar.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50/5 border border-slate-700/60">
            <div className="font-semibold mb-1 text-slate-100 text-[11px]">3 — Output</div>
            <p className="text-slate-200/90">Persona card, Ideal Candidate bullets, JD draft, JSON.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 1 & 2 — What you capture",
      icon: "✍️",
      body: [
        "Top half is the conversation: where this role lives, who they work with, and what must change.",
        "Sliders are not buzzwords – they’re how this role behaves day-to-day.",
        "Emoji tiles are “extra strengths” you want to highlight in the candidate pool.",
      ],
      layout: (
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50/5 border border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-100 mb-1">Context form</div>
            <p className="text-slate-200/90">Organisation, stage, key challenges, team, culture, priorities.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50/5 border border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-100 mb-1">Persona sliders</div>
            <p className="text-slate-200/90">Move sliders to match the persona in your head; radar updates live.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3 — What you get out",
      icon: "📊",
      body: [
        "Persona Card shows radar + strengths and a fit score for this role shape.",
        "Ideal Candidate bullets give you a ready-made narrative for brief / JD.",
        "JD Draft pulls everything into a keyword-rich description you can refine.",
      ],
      layout: (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 text-slate-50 border border-slate-700/80">
            <div className="text-[11px] font-semibold text-slate-200 mb-1">Persona Card</div>
            <p>Radar + strengths + fit score for the ideal profile.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50/5 border border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-100 mb-1">Ideal Candidate</div>
            <p className="text-slate-200/90">Bullet list of how this person works and where they add value.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50/5 border border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-100 mb-1">JD Draft</div>
            <p className="text-slate-200/90">Generated JD text you can copy into your ATS or share with recruiters.</p>
          </div>
        </div>
      ),
    },
  ] as const;

  const current = slides[tourStep];

  const goNext = () => {
    if (tourStep < slides.length - 1) setTourStep((prev) => prev + 1);
    else onStart();
  };

  const goPrev = () => {
    if (tourStep > 0) setTourStep((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        className="max-w-xl w-full mx-4 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl p-6"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{current.icon}</div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-50">{current.title}</h2>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-slate-300 hover:text-slate-100"
          >
            Skip for now
          </button>
        </div>

        <ul className="text-sm text-slate-200 space-y-1 mb-2">
          {current.body.map((line, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-[3px] text-[10px]">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {current.layout}

        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTourStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === tourStep ? "bg-slate-50" : "bg-slate-500"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={tourStep === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-500 text-xs text-slate-100 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-900 text-xs"
            >
              {tourStep === slides.length - 1 ? "Start the demo" : "Next"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ============================
   Main App
   ============================ */

export default function App(): JSX.Element {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // apply theme class to <body>
  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
  }, [theme]);

  // ✅ Always show walkthrough on first load in this session
  const [walkthroughSeen, setWalkthroughSeen] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(true);

  const markWalkthroughSeen = () => {
    setShowWalkthrough(false);
    setWalkthroughSeen(true);
  };

  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);

  // Step 1 — Context
  const [orgName, setOrgName] = useState("Sand Tech Holdings Ltd");
  const [stage, setStage] = useState("Transformation");
  const [challenges, setChallenges] = useState(
    "ERP stabilisation, integration gaps, governance vs delivery balance",
  );
  const [team, setTeam] = useState(
    "PMO of 5; reports to Head of Technology; close with Finance/Operations/Vendors",
  );
  const [culture, setCulture] = useState("Collaborative, fast-paced, pragmatic");
  const [priorities, setPriorities] = useState(
    "Stabilise ERP, close integration gaps, restore reporting standards",
  );

  // Step 2 — Purpose
  const [title, setTitle] = useState("ERP Transformation Manager");
  const [purpose, setPurpose] = useState(
    "Align technology delivery with business outcomes and make ERP a single source of truth.",
  );
  const [scope, setScope] = useState("Manager");
  const [decisionLevel, setDecisionLevel] = useState("Hybrid");
  const [influence, setInfluence] = useState(
    "3–5 direct reports; multi-region influence with vendors",
  );

  // Step 3 — Persona attributes
  const [scores, setScores] = useState<number[]>([...DEFAULT_SCORES]);
  const [weights, setWeights] = useState<number[]>([...DEFAULT_WEIGHTS]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);

  // Step 4 — Success metrics
  const [shortTerm, setShortTerm] = useState(
    "ERP data stabilised; ownership model agreed; integration map documented with initial fixes.",
  );
  const [longTerm, setLongTerm] = useState(
    "Cross-functional reporting live; improved adoption; reduced downtime and duplication.",
  );
  const [culturalImpact, setCulturalImpact] = useState(
    "Establish calm, structured delivery rhythm; build trust via transparency.",
  );

  /* Derived data */

  const data: RadarDatum[] = useMemo(
    () => AXES.map((axis, i) => ({ axis, Persona: scores[i] })), [scores],
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
      influence ? `Span of influence: ${influence}.` : null,
      culture ? `Thrives in a ${culture.toLowerCase()} environment.` : null,
      priorities ? `Motivated by priorities such as: ${priorities}.` : null,
      strengths.length ? `Brings additional strengths in ${strengths.join(", ")}.` : null,
      shortTerm ? `90-day focus: ${shortTerm}` : null,
    ].filter(Boolean) as string[];

    return bullets;
  }, [
    scores,
    selectedStrengths,
    decisionLevel,
    scope,
    team,
    influence,
    culture,
    priorities,
    shortTerm,
  ]);

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

  /* Nav */

  const next = () => {
    setStep((s) => {
      const nextStep = Math.min(s + 1, STEPS.length - 1);
      setMaxReached((prev) => Math.max(prev, nextStep));
      return nextStep;
    });
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleStepClick = (index: number) => {
    if (index <= maxReached) setStep(index);
  };

  /* Download JSON */

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_persona.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* Render */

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ✅ Walkthrough overlay – now actually rendered */}
      {showWalkthrough && (
        <WalkthroughOverlay
          onStart={() => {
            setStep(0);
            setMaxReached(0);
            markWalkthroughSeen();
          }}
          onSkip={markWalkthroughSeen}
        />
      )}

      {/* Ambient gradient blobs (driven by body.theme-*) */}
      <div className="ambient-blob blob-top" />
      <div className="ambient-blob blob-bottom" />

      {/* Main content sits above blobs */}
      <div className="relative max-w-5xl mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-slate-50"
        >
          Persona Builder — {title}
        </motion.h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <p className="text-sm sm:text-base text-slate-200">
            Persona-first → JD-second. Capture context, shape the persona, and generate an Ideal Candidate
            profile & JD.
          </p>

          <div className="flex items-center gap-2">
            {/* Walkthrough trigger (reopen) */}
            <motion.button
              type="button"
              onClick={() => setShowWalkthrough(true)}
              whileTap={{ scale: 0.97 }}
              className="px-3 py-1.5 rounded-full border border-white/30 bg-white/10 text-xs text-slate-50 flex items-center gap-1"
            >
              <span>Walkthrough</span>
              {walkthroughSeen && <span className="text-[10px]">✓</span>}
            </motion.button>

            {/* Theme toggle – still semi-dark vs softer mode */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3 py-1.5 rounded-full border border-white/30 bg-black/30 text-xs text-slate-50 flex items-center gap-1"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3 h-3" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3" />
                  <span>Dark</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        <Stepper current={step} maxAllowed={maxReached} onStepClick={handleStepClick} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-panel p-5">
              {/* Step 0 — Context */}
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-slate-50">Setting the Scene</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-100">Organisation / Department</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 placeholder:text-slate-400 focus:outline-none
                                   focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-100">Stage</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                      >
                        {["Start-up", "Growth", "Transformation", "Stabilisation", "Mature"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-100">Key Challenges</label>
                      <textarea
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 placeholder:text-slate-400 focus:outline-none
                                   focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        rows={2}
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-100">Team Structure</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 placeholder:text-slate-400 focus:outline-none
                                   focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-100">Culture</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 placeholder:text-slate-400 focus:outline-none
                                   focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        value={culture}
                        onChange={(e) => setCulture(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-100">Priorities (3–6 months)</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 placeholder:text-slate-400 focus:outline-none
                                   focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
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
                  <h2 className="text-lg font-semibold mb-4 text-slate-50">Role Purpose & Scope</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-100">Role Title</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-100">Scope Level</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                      >
                        {["Individual Contributor", "Manager", "Head", "Director"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-100">Primary Purpose (1 sentence)</label>
                      <textarea
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        rows={2}
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-100">Decision Level</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        value={decisionLevel}
                        onChange={(e) => setDecisionLevel(e.target.value)}
                      >
                        {["Strategic", "Tactical", "Operational", "Hybrid"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-100">Influence / Span</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
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
                  <h2 className="text-lg font-semibold mb-2 text-slate-50">Persona Attributes</h2>
                  <p className="text-sm text-slate-200 mb-4">
                    Rate the expected level for the <em>ideal persona</em> (1 = basic, 5 = expert). Adjust weights if
                    certain axes matter more.
                  </p>

                  {AXES.map((axis, i) => (
                    <Slider
                      key={axis}
                      label={axis}
                      value={scores[i]}
                      onChange={(v) => setScores((prev) => prev.map((p, idx) => (idx === i ? v : p)))}
                      help="Set the target strength for this attribute."
                    />
                  ))}

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-100">
                      Weights (advanced)
                    </summary>
                    <div className="grid sm:grid-cols-2 gap-3 mt-3">
                      {AXES.map((axis, i) => (
                        <div key={axis} className="flex items-center gap-2">
                          <label className="text-sm text-slate-100 w-48">{axis}</label>
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
                            className="w-24 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-50
                                       focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 mt-2">
                      Tip: weights should sum to ~1.00. Current total:{" "}
                      <strong>{weights.reduce((a, b) => a + b, 0).toFixed(2)}</strong>
                    </p>
                  </details>

                  <div className="mt-6">
                    <h3 className="text-base font-semibold mb-2 text-slate-50">
                      Select Additional Strengths (max 4)
                    </h3>
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
                            className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                              selected
                                ? "border-violet-300 bg-violet-500/15 shadow-sm"
                                : "border-slate-600/70 bg-slate-900/40 hover:border-violet-300 hover:bg-violet-500/10"
                            }`}
                            aria-pressed={selected}
                          >
                            <div className="text-xl">{opt.emoji}</div>
                            <span className="text-sm text-slate-50">{opt.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-300 mt-2">
                      Tip: choose differentiators that complement the core competencies above.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3 — Success Metrics */}
              {step === 3 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-slate-50">Success Metrics</h2>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-100">90-Day Success</label>
                      <textarea
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        rows={2}
                        value={shortTerm}
                        onChange={(e) => setShortTerm(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-100">12–18 Month Outcomes</label>
                      <textarea
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        rows={2}
                        value={longTerm}
                        onChange={(e) => setLongTerm(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-100">Cultural Impact</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm
                                   text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                        value={culturalImpact}
                        onChange={(e) => setCulturalImpact(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 — Persona Card */}
              {step === 4 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-slate-50">Persona Card</h2>
                  <p className="text-sm text-slate-200 mb-4">
                    This radar represents the <strong>ideal persona</strong> targets you set. Use it to inform JD and
                    shortlisting.
                  </p>

                  <div className="text-center mb-2">
                    <div className="text-sm tracking-wider font-bold text-slate-100">
                      CORE COMPETENCIES
                    </div>
                  </div>
                  <div className="w-full h-80 bg-slate-900/60 rounded-xl shadow-inner p-3 border border-slate-600/70">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#4b5563" />
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#e5e7eb" }} />
                        <PolarRadiusAxis
                          angle={45}
                          domain={[0, 5]}
                          tick={{ fontSize: 10, fill: "#9ca3af" }}
                          stroke="#4b5563"
                        />
                        <Radar
                          name="Persona"
                          dataKey="Persona"
                          stroke="#a855f7"
                          fill="#a855f7"
                          fillOpacity={0.25}
                          dot
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Additional Strengths */}
                  <div className="mt-5">
                    <div className="text-center mb-2">
                      <div className="text-sm tracking-wider font-bold text-slate-100">
                        ADDITIONAL STRENGTHS
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedStrengths.length === 0 && (
                        <div className="col-span-2 sm:col-span-4 text-center text-sm text-slate-300">
                          No strengths selected yet.
                        </div>
                      )}
                      {selectedStrengths.map((id) => {
                        const opt = STRENGTH_OPTIONS.find((o) => o.id === id);
                        if (!opt) return null;
                        return (
                          <motion.div
                            key={id}
                            whileHover={{ y: -2 }}
                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-600/70 bg-slate-900/60 shadow-sm"
                          >
                            <div className="text-2xl mb-1">{opt.emoji}</div>
                            <div className="text-xs text-center font-medium text-slate-100">{opt.label}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fit + Meta */}
                  <div className="mt-4 grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-600/80">
                      <div className="text-xs text-slate-300">Persona Fit</div>
                      <div className="text-2xl font-bold text-slate-50">{fitScore}</div>
                      <div className="text-xs text-slate-400">Weighted persona strength (0–100)</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-600/80">
                      <div className="text-xs text-slate-300">Role</div>
                      <div className="font-semibold text-slate-50">{title}</div>
                      <div className="text-xs text-slate-400">{orgName}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-600/80">
                      <div className="text-xs text-slate-300">Stage</div>
                      <div className="font-semibold text-slate-50">{stage}</div>
                      <div className="text-xs text-slate-400">
                        Decision: {decisionLevel} • Scope: {scope}
                      </div>
                    </div>
                  </div>

                  {/* Ideal Candidate Profile */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-900/70 border border-slate-600/80 text-sm">
                    <div className="font-semibold mb-2 text-slate-50">Ideal Candidate Profile</div>
                    {idealBullets.length === 0 ? (
                      <div className="text-slate-300">
                        Adjust the persona sliders and context to generate a profile.
                      </div>
                    ) : (
                      <ul className="list-disc pl-5 space-y-1 text-slate-100">
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
                        className="px-3 py-1.5 rounded-lg border border-slate-500 text-xs text-slate-100"
                      >
                        Copy Profile
                      </button>
                    </div>
                  </div>

                  {/* JD Draft */}
                  <div className="mt-5 p-4 rounded-xl bg-slate-900/70 border border-slate-600/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm tracking-wider font-bold text-slate-100">JD DRAFT</div>
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
                          className="px-3 py-1.5 rounded-lg border border-slate-500 text-xs text-slate-100"
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
                          className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-900 text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="jd-draft"
                      rows={8}
                      className="w-full rounded-xl border border-slate-600/80 bg-slate-950/60 px-3 py-2 text-sm text-slate-50
                                 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-transparent"
                      placeholder="Click 'Generate JD Draft' to populate..."
                    />
                  </div>

                  <div className="flex items-center justify-end mt-4">
                    <button
                      onClick={downloadJSON}
                      className="px-4 py-2 rounded-xl bg-slate-50 text-slate-900 text-sm font-semibold shadow"
                    >
                      Download Persona JSON
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={back}
                disabled={step === 0}
                className="px-4 py-2 rounded-xl border border-slate-400 bg-slate-900/60 text-slate-100 disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={next}
                disabled={step === STEPS.length - 1}
                className="px-4 py-2 rounded-xl bg-slate-50 text-slate-900 disabled:opacity-40"
              >
                {step === STEPS.length - 1 ? "Done" : "Next"}
              </button>
            </div>
          </div>

          {/* Right: checklist / JSON */}
          <aside className="glass-panel-soft p-5 h-max sticky top-4">
            <h3 className="font-semibold mb-3">Checklist</h3>
            <ul className="text-sm space-y-2">
              <li>
                • Context ✓ <strong>{orgName && stage ? "Ready" : ""}</strong>
              </li>
              <li>
                • Role purpose ✓ <strong>{title && purpose ? "Ready" : ""}</strong>
              </li>
              <li>
                • Persona sliders ✓{" "}
                <strong>{scores.every((s) => s >= 1) ? "Ready" : ""}</strong>
              </li>
              <li>
                • Success metrics ✓{" "}
                <strong>{shortTerm && longTerm ? "Ready" : ""}</strong>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-slate-900/70 text-xs text-slate-200">
              Fit score responds live to persona sliders and weights.
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold">
                Raw JSON{" "}
                <span className="text-xs font-normal text-slate-300">
                  (for storage / integration)
                </span>
              </summary>
              <pre className="mt-2 text-[11px] bg-slate-900/80 p-2 rounded-xl overflow-auto max-h-64 text-slate-100">
                {JSON.stringify(jsonPayload, null, 2)}
              </pre>
            </details>
          </aside>
        </div>
      </div>
    </div>
  );
}
