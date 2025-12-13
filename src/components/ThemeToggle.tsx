import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("pw_theme");
    const initial = saved === "dark" ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.add(initial);
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("pw_theme", theme);
  }, [theme]);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-300 bg-white shadow-sm text-xs 
                 hover:bg-gray-100 transition-all select-none"
    >
      {theme === "light" ? (
        <>
          <Moon size={16} className="text-gray-700" />
          <span>Dark mode</span>
        </>
      ) : (
        <>
          <Sun size={16} className="text-yellow-400" />
          <span>Light mode</span>
        </>
      )}
    </motion.button>
  );
}
