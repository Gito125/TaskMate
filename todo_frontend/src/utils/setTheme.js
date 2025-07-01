// Set initial theme based on localStorage or default to light
export const setTheme = () => {
  // Check if theme is already set in localStorage
  // Reset and apply new theme class to <html>
  const theme = localStorage.getItem("theme") || "light";
  if (!["jet", "light", "dark", "sienna"].includes(theme))
    document.documentElement.className = "";
  document.documentElement.classList.add(`theme-${theme}`);
  localStorage.setItem("theme", theme);
};