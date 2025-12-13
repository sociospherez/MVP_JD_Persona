export type ThemeName = "dark" | "light";

const THEME_LINK_ID = "persona-theme-css";

export function applyTheme(theme: ThemeName) {
  const href = theme === "dark"
    ? "/src/themes/dark.css"
    : "/src/themes/light.css";

  let link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.id = THEME_LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  link.href = href;

  // optional: handy attribute for debugging
  document.documentElement.setAttribute("data-theme", theme);
}
