import { useCallback, useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import CustomTypewriter from "./CustomeTypeWriter";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get("me/");
      setUser(res.data);
      document.title = `Welcome ${res.data.username}`;
    } catch (err) {
      console.error("Fetch user error:", err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* 🔝 Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 gap-4 sm:gap-0 bg-[var(--accent)] text-[var(--bg)] shadow-md">
        <div className="flex items-center justify-center w-full sm:w-auto">
          <h1 className="text-xl font-bold tracking-wide text-[var(--text)]">📝 PrimeTasks</h1>

          {/* Hamburger for theme dropdown */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="ml-2 px-3 py-1 rounded bg-[var(--bg)] text-[var(--text)] border border-[var(--text)]"
            >
              🎨 Themes
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 z-50 bg-[var(--bg)] border border-[var(--text)] rounded shadow p-2">
                <ThemeSwitcher />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 items-center justify-center flex-wrap w-full sm:w-auto">
          {/* 🌗 ThemeSwitcher - only visible on medium+ screens */}
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>

          {/* 🚪 Logout */}
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded bg-[var(--bg)] text-[var(--text)] cursor-pointer hover:text-[var(--bg)] hover:bg-[var(--text)] border border-[var(--text)] hover:bg-opacity-90 transition shadow-lg"
          >
            Logout
          </button>
        </div>
      </header>

  
      {/* 👤 Welcome Typewriter */}
      {user && (
        <div className="p-2 text-sm text-[var(--text)] text-center sm:text-left">
          <span className="font-semibold">Welcome,</span>{" "}
          <CustomTypewriter
            words={[` ${user.username}`]}
            speed={300}
            pause={1000}
            loop
            cursorChar="⚡"
            delayBeforeStart={1000}
          />
        </div>
      )}

      {/* 📦 Main Content */}
      <main className="p-1 sm:p-2">{children}</main>
    </div>
  );
};

export default Layout;
