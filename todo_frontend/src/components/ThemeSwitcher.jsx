import { useState, useEffect } from "react";

const themes = ["jet", "light", "dark", "sienna"];

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    // Reset and apply new theme class to <html>
    document.documentElement.className = "";
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex gap-2 justify-center mb-6 flex-wrap">
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-3 py-1 rounded border text-sm capitalize transition duration-150 ease-in-out
            ${
              theme === t
                ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]"
                : "bg-transparent text-[var(--text)] border-[var(--text)] hover:opacity-70"
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
