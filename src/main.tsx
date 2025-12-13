import React, { createContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/* =======================================================
   THEME CONTEXT (global)
   ======================================================= */
type Theme = "light" | "dark";

export const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
});

/* =======================================================
   THEME PROVIDER
   ======================================================= */
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  /* Load theme from localStorage or default to dark */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("personaTheme") as Theme | null;
      if (saved) {
        setTheme(saved);
        document.documentElement.classList.toggle("dark", saved === "dark");
        applyStylesheet(saved);
      } else {
        document.documentElement.classList.add("dark"); // default
        applyStylesheet("dark");
      }
    } catch {
      document.documentElement.classList.add("dark");
      applyStylesheet("dark");
    }
  }, []);

  /* Switch <link> stylesheets dynamically */
  const applyStylesheet = (mode: Theme) => {
    const lightSheet = document.getElementById("light-theme") as HTMLLinkElement;
    const darkSheet = document.getElementById("dark-theme") as HTMLLinkElement;

    if (lightSheet && darkSheet) {
      if (mode === "light") {
        lightSheet.disabled = false;
        darkSheet.disabled = true;
      } else {
        lightSheet.disabled = true;
        darkSheet.disabled = false;
      }
    }
  };

  /* Theme toggle handler */
  const toggleTheme = () => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
    applyStylesheet(newTheme);

    try {
      localStorage.setItem("personaTheme", newTheme);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* =======================================================
   RENDER ROOT
   ======================================================= */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
