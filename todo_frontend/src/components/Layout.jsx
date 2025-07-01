import ThemeSwitcher from "./ThemeSwitcher";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* 🔝 Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-[var(--accent)] text-[var(--bg)] shadow-md">
        <h1 className="text-xl font-bold tracking-wide">📝 PrimeTasks</h1>
        <div className="flex gap-3 items-center">
          <ThemeSwitcher />
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded bg-[var(--bg)] text-[var(--accent)] border border-[var(--accent)] hover:bg-opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 📦 Main Content */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;