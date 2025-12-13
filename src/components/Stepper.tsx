import React from "react";
import { motion } from "framer-motion";

export type StepDef = { key: string; label: string };

export default function Stepper({
  steps,
  current,
  maxAllowed,
  onStepClick,
}: {
  steps: StepDef[];
  current: number;
  maxAllowed: number;
  onStepClick?: (index: number) => void;
}) {
  return (
    <div className="flex items-center flex-wrap gap-3 mb-6">
      {steps.map((s, idx) => {
        const active = idx === current;
        const done = idx < current;
        const clickable = idx <= maxAllowed;

        const baseCircle =
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm";

        const circleClass = done
          ? "bg-black text-white"
          : active
          ? "bg-gray-900 text-white"
          : "bg-gray-200 text-gray-700";

        const Node = clickable && onStepClick ? motion.button : "div";

        return (
          <div key={s.key} className="flex items-center">
            <Node
              {...(clickable && onStepClick
                ? {
                    type: "button",
                    onClick: () => onStepClick(idx),
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.97 },
                    className: `${baseCircle} ${circleClass}`,
                  }
                : { className: `${baseCircle} ${circleClass}` })}
              aria-current={active ? "step" : undefined}
            >
              {idx + 1}
            </Node>

            <div className="ml-2 mr-4 text-sm sm:text-base font-medium">
              {s.label}
            </div>

            {idx !== steps.length - 1 && (
              <div className="w-8 h-[2px] bg-black/10 mr-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}
