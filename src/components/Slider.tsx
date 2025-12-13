import React from "react";

export default function Slider({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  help,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <label className="font-medium">{label}</label>
        <span className="text-sm pw-muted">{value}</span>
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
      {help && <p className="text-xs pw-muted mt-1">{help}</p>}
    </div>
  );
}
