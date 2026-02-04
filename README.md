# TaskMate – Smart Task Management Dashboard

A sleek, responsive task manager built with **React (Vite + Tailwind CSS)** and a **Django REST backend**. Drag-and-drop sorting, priority tagging, filtering, editing — all in one beautifully animated dashboard.

---

## Preview

![TaskMate Screenshot](https://task-mate-kappa-rosy.vercel.app/og-preview.png)

---

## Features

- Add, edit, delete tasks effortlessly
- Mark tasks as completed or pending
- Prioritize tasks: High, Medium, Low
- Tag tasks: Work, Study, Personal, Urgent
- Set deadlines and auto-sort by urgency
- Drag-and-drop task reordering (DnD Kit + Framer Motion)
- Filter by status (all / completed / pending)
- Mobile-first responsive design
- Filter state saved in `localStorage`
- Built using:
  - Frontend: **React + Vite + Tailwind CSS**
  - Backend: **Django + Django REST Framework**
  - Animations: **Framer Motion**
  - DnD: **@dnd-kit/core**
  - Toasters: **react-hot-toast**
  - HTTP: **Axios**

---

## Live Demo

🔗 [https://task-mate-kappa-rosy.vercel.app/]

---

## Local Setup

> Requirements:
> - Node.js + npm
> - Python 3.x + pip or pipenv

### Clone the repo

```bash
git clone https://github.com/Gito125/TaskMate.git
cd taskmate

cd todo_backend
pipenv install
pipenv shell
python manage.py migrate
python manage.py runserver

cd ../todo_frontend
pnpm install
pnpm run dev
```

### Folder Structure
taskmate/
├── todo_backend/      # Django REST API
├── todo_frontend/     # React + Tailwind frontend
├── Pipfile            # Python dependency management
└── README.md
