import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// This wrapper makes each task sortable
const SortableTask = ({ task, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex justify-between items-start bg-white/10 backdrop-blur-md border border-text/20 rounded-lg p-1 shadow-sm hover:shadow-xl transition-shadow w-full mb-3"
    >
      {children}  
    </motion.li>
  );
};

const filters = ["all", "completed", "pending"];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [filter, setFilter] = useState(() => localStorage.getItem("filter") || "all");
  const [priority, setPriority] = useState("medium");
  const [tag, setTag] = useState("personal");

  useEffect(() => {
    // Login success message
    toast.success('Logged in successfuly...')
  }, [])

  // Save filter in localStorage
  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  // Load tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get("tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Could not load tasks");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add task
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("tasks/", {
      title,
      deadline,
      priority,
      tag,
    });
      setTitle("");
      setDeadline("");
      fetchTasks();
      toast.success("Task added!");
    } catch (err) {
      console.error(err);
      toast.error("Could not create task");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`tasks/${id}/`);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success("Task deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  // Edit task
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDeadline(task.deadline || "");
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`tasks/${id}/`, {
        title: editTitle,
        deadline: editDeadline,
        priority,
        tag,
      });
      setEditingTaskId(null);
      fetchTasks();
      toast.success("Task updated!");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`tasks/${id}/`, { completed });
      fetchTasks();
      toast.success(`Marked as ${completed ? "completed ✅" : "pending 🔄"}`);
    } catch (err) {
      toast.error("Toggle failed");
      console.error(`The error is ${err}`);
    }
  };

  const filteredTasks = tasks.filter(task =>
    filter === "completed" ? task.completed :
    filter === "pending" ? !task.completed :
    true
  );


  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(task => task.id === active.id);
    const newIndex = tasks.findIndex(task => task.id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    setTasks(reordered);

    // Optional: send new order to backend if you're storing positions
  };


  return (
    <Layout>
      <div className="p-1 max-w-3xl mx-auto">
        <h1 className="text-xl sm:text-3xl font-bold mb-4 text-center text-accent">🧠 Task Dashboard</h1>

        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="flex-1 px-4 py-2 border rounded bg-bg text-[var(--accent)] text-text focus:outline-none focus:ring-2 focus:ring-accent transition shadow-lg"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 px-4 py-2 border rounded bg-bg text-[var(--accent)] text-text focus:outline-none focus:ring-2 focus:ring-accent transition shadow-lg"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 px-4 py-2 border rounded bg-bg text-[var(--accent)] text-text focus:outline-none focus:ring-2 focus:ring-accent transition shadow-lg"
          >
            <option value="low">Low 🔅</option>
            <option value="medium">Medium ⚖️</option>
            <option value="high">High 🔥</option>
          </select>

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="flex-1 px-4 py-2 border rounded bg-bg text-[var(--accent)] text-text focus:outline-none focus:ring-2 focus:ring-accent transition shadow-lg"
          >
            <option value="work">Work 💼</option>
            <option value="study">Study 📚</option>
            <option value="personal">Personal 👤</option>
            <option value="urgent">Urgent 🚨</option>
          </select>


          <button type="submit" className="bg-[var(--accent)] text-[var(--text)] cursor-pointer hover:text-[var(--bg)] hover:bg-[var(--text)] px-4 py-2 rounded hover:opacity-90 transition hover:shadow-lg">
            Add Task
          </button>
        </form>

        <div className="flex justify-center gap-3 mb-6">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded border text-sm capitalize transition ${
                filter === f
                  ? "bg-accent text-bg border-accent"
                  : "bg-transparent border-text text-text hover:opacity-70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredTasks.length === 0 ? (
          <p className="text-center text-sm text-text/60">No tasks under “{filter}” filter 🔍</p>
        ) : (
          <AnimatePresence>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}  // We'll define this below
            >
              <SortableContext
                items={filteredTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredTasks.map((task) => (
                  <SortableTask key={task.id} task={task}>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-between items-start rounded-lg p-4 shadow-sm hover:shadow-xl transition-shadow w-full"
                    >
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <input
                            autoComplete="off"
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleComplete(task.id, !task.completed)}
                            className="accent-accent mt-1"
                          />
                          {editingTaskId === task.id ? (
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <input
                                autoComplete=""
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
                            <div className="mt-1 flex gap-2 text-xs sm:text-sm">
                              <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-text"}`}>
                                {task.title}
                              </h3>
                              {task.deadline && (
                                <p className="text-sm text-text/50">📅 {task.deadline}</p>
                              )}
                              <span className={`px-2 py-1 rounded-full font-semibold ${
                                task.priority === "high" ? "bg-rose-500 text-white" :
                                task.priority === "medium" ? "bg-amber-400 text-black" :
                                "bg-teal-500 text-white"
                              }`}>
                                {task.priority.toUpperCase()}
                              </span>

                              <span className={`px-2 py-1 rounded-full font-medium ${
                                task.tag === "work" ? "bg-indigo-600 text-white" :
                                task.tag === "study" ? "bg-violet-500 text-white" :
                                task.tag === "urgent" ? "bg-crimson-600 text-white" :
                                "bg-slate-600 text-white"
                              }`}>
                                {task.tag}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2 sm:mt-0">
                        {editingTaskId === task.id ? (
                          <button
                            onClick={() => handleUpdate(task.id)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditing(task)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.span>
                  </SortableTask>
                ))}
              </SortableContext>
            </DndContext>
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;