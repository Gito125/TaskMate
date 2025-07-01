import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get("tasks/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-4">🧾 Your Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-sm text-[var(--text)/70]">No tasks found. 🎉</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="p-3 bg-[var(--accent)/10] text-[var(--text)] border border-[var(--accent)/30] rounded shadow-sm"
            >
              {task.title}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <button
          onClick={logout}
          className="text-red-500 hover:underline text-sm"
        >
          🔓 Logout
        </button>
      </div>
    </div>
  );
};

export default Home;