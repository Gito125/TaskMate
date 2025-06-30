import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import ThemeSwitcher from "../components/ThemeSwitcher";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [filter, setFilter] = useState(() => localStorage.getItem("filter") || "all");

  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  // 🔁 Load tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      toast.error("Could not load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ➕ Create Task
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("tasks/", { title, deadline });
      setTitle("");
      setDeadline("");
      fetchTasks();
      toast.success("Task added!");
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Something went wrong");
    }
  };

  // ❌ Delete Task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`tasks/${id}/`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task deleted!");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    }
  };

  // ✏️ Edit Task
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDeadline(task.deadline || "");
  };

  // ✅ Update Task
  const handleUpdate = async (id) => {
    try {
      await axios.put(`tasks/${id}/`, {
        title: editTitle,
        deadline: editDeadline,
      });
      setEditingTaskId(null);
      fetchTasks();
      toast.success("Task updated!");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
    }
  };

  // ✅ Toggle Completion
  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`tasks/${id}/`, { completed });
      fetchTasks();
      toast.success(`Marked as ${completed ? "completed ✅" : "pending 🔄"}`);
    } catch (err) {
      console.error("Error toggling task:", err);
      toast.error("Failed to toggle task");
    }
  };

  // 🗂️ Filtered Task List
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-accent">🧠 Task Dashboard</h1>

        {/* Task Form */}
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="flex-1 px-4 py-2 border rounded bg-bg text-text"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="px-4 py-2 border rounded bg-bg text-text"
          />
          <button type="submit" className="bg-accent text-bg px-4 py-2 rounded hover:opacity-90 transition">
            Add Task
          </button>
        </form>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          {["all", "completed", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded border ${
                filter === f ? "bg-accent text-bg" : "bg-transparent border-text text-text"
              } hover:opacity-80 transition`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <p className="text-center text-sm text-text/60">No tasks under "{filter}" filter 🔍</p>
        ) : (
          <AnimatePresence>
            <motion.ul className="space-y-3">
              {filteredTasks.map((task) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-between items-start bg-white/10 backdrop-blur-md border border-text/20 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id, !task.completed)}
                        className="accent-accent mt-1"
                      />
                      {editingTaskId === task.id ? (
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="px-2 py-1 border rounded w-full bg-bg text-text"
                          />
                          <input
                            type="date"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            className="px-2 py-1 border rounded bg-bg text-text"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-text"}`}>
                            {task.title}
                          </h3>
                          {task.deadline && (
                            <p className="text-sm text-text/50">📅 Deadline: {task.deadline}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    {editingTaskId === task.id ? (
                      <button onClick={() => handleUpdate(task.id)} className="text-green-600 hover:underline">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => startEditing(task)} className="text-blue-600 hover:underline">
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
// This code is a React component for a task dashboard that allows users to create, edit, delete, and filter tasks.