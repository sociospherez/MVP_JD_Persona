import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  title: string;
  icon: string;
  body: string[];
  layout?: React.ReactNode;
};

export default function WalkthroughOverlay({
  open,
  onClose,
  onStart,
}: {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}) {
  const [tourStep, setTourStep] = useState(0);

  const slides: Slide[] = [
    {
      title: "Welcome to the Persona Wizard (Demo)",
      icon: "🧭",
      body: [
        "You’re role-playing the hiring manager describing the person you need.",
        "The wizard turns that into: a persona radar, an ideal candidate profile, and a draft JD.",
        "This demo is pre-filled so you can see a complete outcome fast.",
      ],
      layout: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="pw-card rounded-xl p-3">
            <div className="font-semibold mb-1">1 — Context</div>
            <p className="pw-muted">Org, stage, challenges, team, culture, priorities.</p>
          </div>
          <div className="pw-card rounded-xl p-3">
            <div className="font-semibold mb-1">2 — Persona</div>
            <p className="pw-muted">Sliders + strengths shape the “ideal candidate”.</p>
          </div>
          <div className="pw-card rounded-xl p-3">
            <div className="font-semibold mb-1">3 — Output</div>
            <p className="pw-muted">Persona card, bullets, JD draft, JSON export.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Make it interactive (not a wall of text)",
      icon: "✨",
      body: [
        "Use dropdowns/tags where possible to keep inputs structured.",
        "Sliders update the radar live — that’s your ‘feel’ check.",
        "Strength tiles are differentiators, not noise. Pick max 4.",
      ],
    },
    {
      title: "Outputs you can reuse",
      icon: "📦",
      body: [
        "Copy the Ideal Candidate bullets into a brief or recruiter pack.",
        "Generate a JD draft, then refine language for your org.",
        "Export JSON so we can store personas + compare across roles later.",
      ],
    },
  ];

  const last = tourStep === slides.length - 1;

  const goNext = () => {
    if (!last) setTourStep((p) => p + 1);
    else {
      onStart();
      onClose();
    }
  };

  const goPrev = () => setTourStep((p) => Math.max(0, p - 1));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="max-w-xl w-full mx-4 rounded-2xl pw-card p-6"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="text-2xl">{slides[tourStep].icon}</div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  {slides[tourStep].title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="pw-btn px-2.5 py-1 rounded-lg text-xs"
              >
                Close
              </button>
            </div>

            <ul className="text-sm space-y-1 mb-2">
              {slides[tourStep].body.map((line, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-[3px] text-[10px]">•</span>
                  <span className="pw-muted">{line}</span>
                </li>
              ))}
            </ul>

            {slides[tourStep].layout}

            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTourStep(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === tourStep ? "bg-white" : "bg-white/40"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={tourStep === 0}
                  className="pw-btn px-3 py-1.5 rounded-lg text-xs disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="pw-btn-primary px-3 py-1.5 rounded-lg text-xs"
                >
                  {last ? "Start the demo" : "Next"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
