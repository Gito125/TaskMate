import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme } from "./utils/theme";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-bg text-text transition-colors duration-300">
        <Toaster />
        {/* 🌓 Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-transparent border rounded px-2 py-1 text-sm"
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="system">🖥 System</option>
          </select>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// This is the main entry point for the React application.
// It sets up the router and defines the routes for the application.
// The `/login` route renders the `Login` component, while the root path (`/`) renders the `Home` component.