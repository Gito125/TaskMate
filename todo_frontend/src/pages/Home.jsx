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
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white p-3 rounded shadow">
            {task.title}
          </li>
        ))}
      </ul>

      <button onClick={logout} className="text-red-500 hover:underline">
        Logout
      </button>
    </div>
  );
};

export default Home;
