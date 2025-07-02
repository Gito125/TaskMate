import React from "react";

const ToDoForm = ({ handleCreate, title, setTitle, deadline, setDeadline, priority, setPriority, tag, setTag }) => {
  return (
    <form
      onSubmit={handleCreate}
      className="flex flex-col sm:flex-row gap-2 mb-6"
    >
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

      <button
        type="submit"
        className="bg-[var(--accent)] text-[var(--text)] cursor-pointer hover:text-[var(--bg)] hover:bg-[var(--text)] px-4 py-2 rounded hover:opacity-90 transition hover:shadow-lg"
      >
        Add Task
      </button>
    </form>
  );
};

export default ToDoForm;
