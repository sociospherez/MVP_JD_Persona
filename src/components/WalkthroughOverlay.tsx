import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  title: string;
  kicker: string;
  icon: string;
  cards: { icon: string; title: string; text: string }[];
  footerHint?: string;
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
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Quick Tour",
        kicker: "You’ll finish this demo in ~60 seconds.",
        icon: "🧭",
        cards: [
          { icon: "🧩", title: "Pick a role preset", text: "Start from a realistic baseline (Admin Officer / Sales Assistant)." },
          { icon: "🎛️", title: "Adjust the persona", text: "Sliders + strengths shape the role’s behavior profile." },
          { icon: "📤", title: "Get outputs", text: "Persona radar, Ideal Candidate bullets, JD draft, JSON." },
        ],
        footerHint: "Tip: This isn’t a form — it’s a structured conversation.",
      },
      {
        title: "Inputs",
        kicker: "Make it structured and reusable (less free text).",
        icon: "🧱",
        cards: [
          { icon: "🏷️", title: "Dropdowns & tags", text: "Keep scope/decision/influence consistent across roles." },
          { icon: "🧠", title: "Sliders mean behavior", text: "Not buzzwords — this sets how the role operates day-to-day." },
          { icon: "✨", title: "Strength tiles", text: "Differentiators. Max 4. Keep it crisp." },
        ],
        footerHint: "We’ll expand the structured inputs next (Influence tags, Scope templates, etc.).",
      },
      {
        title: "Outputs & Next",
        kicker: "Turn this into a repeatable Persona Bank.",
        icon: "📦",
        cards: [
          { icon: "🪪", title: "Persona Card", text: "A stable snapshot you can reuse and compare." },
          { icon: "🧾", title: "JD draft", text: "Start fast, refine tone and compliance." },
          { icon: "🏦", title: "Save persona", text: "Store versions per role and load later in 1 click." },
        ],
        footerHint: "Next: Persona Bank tab (save/load/delete/compare).",
      },
    ],
    [],
  );

  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const last = idx === slides.length - 1;

  const next = () => (last ? (onStart(), onClose()) : setIdx((p) => p + 1));
  const prev = () => setIdx((p) => Math.max(0, p - 1));

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
            className="max-w-3xl w-full mx-4 rounded-2xl pw-card p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{slide.icon}</div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">{slide.title}</h2>
                  <div className="text-sm pw-muted">{slide.kicker}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="pw-btn px-2.5 py-1.5 rounded-lg text-xs"
              >
                Close
              </button>
            </div>

            {/* Visual cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {slide.cards.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="pw-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl">{c.icon}</div>
                    <div className="font-semibold">{c.title}</div>
                  </div>
                  <div className="text-sm pw-muted">{c.text}</div>
                </motion.div>
              ))}
            </div>

            {/* Footer hint */}
            {slide.footerHint && (
              <div className="mt-4 pw-card rounded-xl p-3 text-xs pw-muted">
                {slide.footerHint}
              </div>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === idx ? "bg-white" : "bg-white/40"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  disabled={idx === 0}
                  className="pw-btn px-3 py-1.5 rounded-lg text-xs disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={next}
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
