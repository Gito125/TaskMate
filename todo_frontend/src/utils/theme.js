// This utility manages the theme (light or dark) for the application.
// It checks for the user's preference in local storage or system settings and applies the theme accordingly.
// It also provides a function to get the initial theme and apply the selected theme.
// It is used to ensure a consistent user experience across sessions.

export const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) return storedTheme;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const applyTheme = (theme) => {
  if (typeof window === "undefined") return;
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
};
