import React from "react";
import { ThemeName } from "../theme/theme";

export default function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: ThemeName;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="pw-btn px-3 py-1.5 rounded-full text-xs flex items-center gap-2"
      aria-label="Toggle theme"
    >
      <span className="text-sm">{theme === "dark" ? "🌙" : "☀️"}</span>
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
