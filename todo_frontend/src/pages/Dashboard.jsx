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
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTask from "../components/SortableTask";
import FilterButtons from "../components/FilterButtons";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const TAG_ICONS = {
  work: "💼",
  study: "📚",
  personal: "👤",
  urgent: "🚨",
};

export default function Dashboard() {
  // State
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tag, setTag] = useState("personal");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editTag, setEditTag] = useState("personal");
  const [filter, setFilter] = useState(
    () => localStorage.getItem("filter") || "all"
  );

  // Persist filter
  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get("tasks/");
      setTasks(data);
    } catch {
      toast.error("Could not load tasks");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create
  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post("tasks/", { title, deadline, priority, tag });
    setTitle("");
    setDeadline("");
    setPriority("medium");
    setTag("personal");
    fetchTasks();
    toast.success("Task added!");
  };

  // Delete
  const handleDelete = async (id) => {
    await axios.delete(`tasks/${id}/`);
    setTasks((t) => t.filter((x) => x.id !== id));
    toast.success("Task deleted");
  };

  // Start edit
  const startEditing = (t) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDeadline(t.deadline || "");
    setEditPriority(t.priority);
    setEditTag(t.tag);
  };

  // Update
  const handleUpdate = async (id) => {
    await axios.put(`tasks/${id}/`, {
      title: editTitle,
      deadline: editDeadline,
      priority: editPriority,
      tag: editTag,
    });
    setEditingId(null);
    fetchTasks();
    toast.success("Task updated!");
  };

  // Toggle complete
  const toggleComplete = async (id, val) => {
    await axios.patch(`tasks/${id}/`, { completed: val });
    fetchTasks();
    toast.success(val ? "Completed ✅" : "Pending 🔄");
  };

  // Filter & sort
  const filtered = tasks
    .filter((t) =>
      filter === "completed" ? t.completed : filter === "pending" ? !t.completed : true
    )
    .sort((a, b) => {
      const aTime = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const bTime = b.deadline ? new Date(b.deadline).getTime() : Infinity;

      if (aTime !== bTime) return aTime - bTime;
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = tasks.findIndex((t) => t.id === active.id);
    const newIdx = tasks.findIndex((t) => t.id === over.id);
    setTasks((prev) => arrayMove(prev, oldIdx, newIdx));
  };

  return (
    <Layout>
      <div className="p-2 py-0 sm:p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-accent">
          🧠 Task Dashboard
        </h1>

        {/* Form */}
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-4 sm:grid-cols-[2fr,1fr,auto,auto,auto] gap-2 mb-6"
        >
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="col-span-full px-3 py-2 border rounded bg-bg text-[var(--accent)]"
          />

          {/* Date select: icon on mobile */}
          <div className="relative">
            <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none sm:hidden">
              📅
            </span>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 pl-8 sm:pl-3 border rounded bg-bg text-[var(--accent)]"
            />
          </div>

          {/* Priority */}
          <div className="relative">
            <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none sm:hidden">
              {priority === "low"
                ? "🟢"
                : priority === "medium"
                ? "🟡"
                : "🔴"}
            </span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 pl-8 sm:pl-3 border rounded bg-bg text-[var(--accent)]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Tag */}
          <div className="relative">
            <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none  sm:hidden">
              {TAG_ICONS[tag]}
            </span>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 pl-8 sm:pl-3 border rounded bg-bg text-[var(--accent)]"
            >
              {Object.entries(TAG_ICONS).map(([key]) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button className="px-4 py-2 bg-[var(--accent)] text-[var(--text)] rounded hover:opacity-90 transition">
            Add
          </button>
        </form>

        {/* Filters */}
        <FilterButtons filter={filter} setFilter={setFilter} />

        {/* Task List */}
        {filtered.length === 0 ? (
          <p className="text-center text-[var(--accent)]/60">No tasks under “{filter}”</p>
        ) : (
          <AnimatePresence>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filtered.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {filtered.map((task) => (
                  <SortableTask key={task.id} task={task}>
                    <div className="p-1 py-2 flex flex-col sm:flex-row sm:items-center justify-between w-full">
                      {/* Left: checkbox + title */}
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task.id, !task.completed)}
                          className="accent-accent"
                        />
                        {editingId === task.id ? (
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded bg-bg text-[var(--accent)]"
                          />
                        ) : (
                          <h3
                            className={`flex-1 font-medium ${
                              task.completed ? "line-through text-gray-500" : "text-[var(--text)]"
                            }`}
                          >
                            {task.title}
                          </h3>
                        )}
                      </div>

                      {/* Middle: deadline, priority, tag */}
                      <div className="flex items-center gap-3 mt-2 sm:mt-0">
                        {editingId === task.id ? (
                          <>
                            <input
                              type="date"
                              value={editDeadline}
                              onChange={(e) => setEditDeadline(e.target.value)}
                              className="px-2 py-1 border rounded bg-bg text-[var(--accent)]"
                            />

                            <select
                              value={editPriority}
                              onChange={(e) => setEditPriority(e.target.value)}
                              className="px-2 py-1 border rounded bg-bg text-[var(--accent)]"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>

                            <select
                              value={editTag}
                              onChange={(e) => setEditTag(e.target.value)}
                              className="px-2 py-1 border rounded bg-bg text-[var(--accent)]"
                            >
                              {Object.entries(TAG_ICONS).map(([k, ic]) => (
                                <option key={k} value={k}>
                                  {ic} {k.charAt(0).toUpperCase() + k.slice(1)}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <>
                            {task.deadline && <span className="text-sm">📅 {task.deadline}</span>}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                task.priority === "high"
                                  ? "bg-rose-500 text-white"
                                  : task.priority === "medium"
                                  ? "bg-amber-400 text-black"
                                  : "bg-teal-500 text-white"
                              }`}
                            >
                              {task.priority.charAt(0).toUpperCase()}
                            </span>
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium bg-slate-600 text-white"
                              title={task.tag}
                            >
                              {TAG_ICONS[task.tag]}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        {editingId === task.id ? (
                          <button
                            onClick={() => handleUpdate(task.id)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditing(task)}
                            className="text-blue-600 hover:underline mx-1"
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
                    </div>
                  </SortableTask>
                ))}
              </SortableContext>
            </DndContext>
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
}