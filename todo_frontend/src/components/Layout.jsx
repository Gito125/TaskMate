import ThemeSwitcher from "./ThemeSwitcher";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg text-text transition-colors">
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-accent to-bg shadow-md">
        <h1 className="text-xl font-bold">📝 PrimeTasks</h1>
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded bg-text text-bg hover:opacity-80"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;
// This code defines a Layout component that serves as a wrapper for the main content of the application.
// It includes a header with a title, a theme switcher, and a logout button.