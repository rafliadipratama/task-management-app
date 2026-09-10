# Task Management App

A full-stack, end-to-end task management web application built for the **Spend Group Web Developer Technical Test**.

This repository is structured as a clean monorepo containing a **Next.js (App Router)** frontend, an **Express.js + TypeScript** REST API backend, and **Prisma ORM** connecting to a relational database (**PostgreSQL**, with zero-config **SQLite** fallback for instant local evaluation).

---

## 🌟 Table of Contents

- [Features](#-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Tech Stack Justification](#-tech-stack-justification--library-choices)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Quick Start Guide](#-quick-start-guide)
  - [Option A: Instant Local Setup (SQLite - 0 External Dependencies)](#option-a-instant-local-setup-recommended-for-quick-evaluation)
  - [Option B: PostgreSQL with Docker Compose](#option-b-postgresql-with-docker-compose)
  - [Option C: PostgreSQL with Local Service](#option-c-postgresql-with-local-service)
- [Database Schema & Migrations](#-database-schema--migrations)
- [REST API Reference](#-rest-api-reference)
- [Assumptions & Design Decisions](#-assumptions--design-decisions)
- [Testing & Quality Assurance](#-testing--quality-assurance)

---

## ✨ Features

### 1. Client-Side (Frontend)
- **Projects Overview Dashboard**:
  - Displays all projects in responsive cards.
  - Shows overall task count, completion percentage, and breakdown badges (To Do, In Progress, Done).
  - Aggregate statistics bar (Total Projects, Total Tasks, In Progress, Completed).
  - Search filter for projects.
  - Create and edit project modal with client-side & server-side validation.
  - Delete project with cascading task cleanup and confirmation modal.
- **Project Detail Page (`/projects/[id]`)**:
  - Breadcrumb navigation back to project list.
  - Project summary header with progress bar and statistics counters.
  - Real-time task filtering by:
    - **Keyword Search**: Instant debounce search across task titles and descriptions.
    - **Status Filter**: `All`, `To Do`, `In Progress`, `Done`.
    - **Priority Filter**: `All`, `Low`, `Medium`, `High`.
  - Task management:
    - Create new task with modal form.
    - Edit existing task details.
    - Delete task with safety confirmation dialog.
    - 1-click status switcher (`Todo`, `In Progress`, `Done`) with optimistic UI updates.
    - Priority visual badge indicators (Green for Low, Indigo for Medium, Rose for High).
- **Comprehensive UI States**:
  - **Loading state**: Polished skeleton loading for projects and task lists.
  - **Empty state**: Informative illustrations and action buttons for "No projects yet", "No tasks in project yet", and "No tasks match filters".
  - **Error state**: Clean error banner with retry triggers.
  - **Success state**: Toast notifications for all operations (create, update, delete, status toggle).
- **Responsive Design**: Designed for smooth usability across mobile phones, tablets, and desktop displays.

### 2. Server-Side (Backend)
- **RESTful API**: Standardized JSON endpoints for Project and Task resources.
- **Relational Database**: One-to-Many relationship (one Project has many Tasks) with cascade deletion.
- **Schema Validation**: Robust runtime schema validation using **Zod** for both request body and query parameters.
- **Error Handling**: Centralized error middleware returning uniform error responses.
- **Security & Logging**: Production-ready middleware including Helmet, CORS, and Morgan.

---

## 🛠 Architecture & Tech Stack

| Layer | Technology | Version | Role |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router) | 14.2.x | Modern React Framework with Server and Client Components |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.7.x | Type safety across entire application |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 3.4.x | Utility-first, clean responsive UI styling |
| **Icons** | [Lucide React](https://lucide.dev/) | 0.468.x | Lightweight SVG icon system |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) | 2.4.x | Non-intrusive feedback toast notifications |
| **Backend** | [Express.js](https://expressjs.com/) | 4.21.x | Fast, unopinionated REST API framework |
| **ORM** | [Prisma ORM](https://www.prisma.io/) | 5.22.x | Next-generation Node.js & TypeScript ORM |
| **Validation** | [Zod](https://zod.dev/) | 3.23.x | TypeScript-first schema declaration & validation |
| **Database** | PostgreSQL / SQLite | 16 / 3 | Relational SQL database storage |

---

## 💡 Tech Stack Justification & Library Choices

As required by the technical guidelines:

1. **Next.js (App Router)**:
   - Chosen for its standard directory-based routing (`/` and `/projects/[id]`), excellent SEO foundations, and clean separation between layout and page views.
2. **Express.js + TypeScript**:
   - Chosen for clarity, maintainability, and readability. A layered architecture (`routes` -> `controllers` -> `services` -> `validations`) provides separation of concerns without over-engineering.
3. **Prisma ORM**:
   - Provides end-to-end type safety, automated migration management, intuitive relational queries (`include: { tasks: true }`), and seamless seeding.
4. **Zod Validation**:
   - Guarantees strict runtime validation for incoming payloads and query parameters before reaching database controllers, returning descriptive error messages.
5. **Tailwind CSS**:
   - Enables fast, responsive design focused on usability and clean visual hierarchy without bloat.
6. **Dual Database Flexibility (PostgreSQL & SQLite)**:
   - While PostgreSQL is the primary database specified in the brief, an automated SQLite setup script is included so that reviewers can evaluate the application instantly without needing Docker or a live database server.

---

## 📁 Project Structure

```
task-management-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma              # Active Prisma schema
│   │   ├── schema.postgres.prisma     # PostgreSQL schema reference
│   │   ├── schema.sqlite.prisma       # SQLite schema reference
│   │   ├── seed.ts                    # Realistic mock data seed script
│   │   └── migrations/
│   │       └── 20260910000000_init/
│   │           └── migration.sql      # PostgreSQL DDL migration SQL
│   ├── src/
│   │   ├── config/                    # Environment & Prisma client
│   │   ├── controllers/               # HTTP request handlers
│   │   ├── middleware/                # Validation & error handlers
│   │   ├── routes/                    # Express REST route definitions
│   │   ├── services/                  # Business logic & database operations
│   │   ├── validations/               # Zod validation schemas
│   │   └── index.ts                   # Express server entry point
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout & providers
│   │   │   ├── page.tsx               # Projects dashboard view
│   │   │   ├── globals.css            # Tailwind directives
│   │   │   └── projects/[id]/
│   │   │       └── page.tsx           # Project detail & task management
│   │   ├── components/                # Reusable UI components
│   │   │   ├── Badge.tsx              # Status and Priority pills
│   │   │   ├── ConfirmDialog.tsx      # Deletion confirmation dialog
│   │   │   ├── EmptyState.tsx         # Empty state representations
│   │   │   ├── ErrorState.tsx         # Error fallback with retry
│   │   │   ├── LoadingSkeleton.tsx    # Skeletons for cards and details
│   │   │   ├── Modal.tsx              # Base accessible modal
│   │   │   ├── Navbar.tsx             # Top header bar
│   │   │   ├── ProgressBar.tsx        # Project progress indicator
│   │   │   ├── ProjectCard.tsx        # Project summary card
│   │   │   ├── ProjectModal.tsx       # Create/Edit project form
│   │   │   ├── TaskCard.tsx           # Task card with status changer
│   │   │   ├── TaskFilters.tsx        # Search, status & priority filters
│   │   │   ├── TaskModal.tsx          # Create/Edit task form
│   │   │   └── ToastProvider.tsx      # React-hot-toast configuration
│   │   ├── lib/
│   │   │   ├── api.ts                 # Typed REST API client
│   │   │   └── utils.ts               # Class merging & formatters
│   │   └── types/
│   │       └── index.ts               # Shared TypeScript interfaces
│   ├── .env.example
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yml                 # PostgreSQL container setup
├── package.json                       # Root workspaces configuration
└── README.md
```

---

## 📋 Prerequisites

- **Node.js**: `v18.17.0` or higher (tested on `v20.18.0`)
- **npm**: `v9.x` or `v10.x`
- Optional: **Docker** & **Docker Compose** (for running PostgreSQL container)

---

## ⚙️ Environment Configuration

### Backend Environment (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Default variables:
```env
PORT=5001
NODE_ENV=development
# For SQLite (instant setup):
DATABASE_URL="file:./dev.db"

# For PostgreSQL (Docker / Local):
# DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/task_management_db?schema=public"

CLIENT_ORIGIN=http://localhost:3000
```

### Frontend Environment (`frontend/.env.local`)

Copy `frontend/.env.example` to `frontend/.env.local`:

```bash
cp frontend/.env.example frontend/.env.local
```

Default variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 🚀 Quick Start Guide

You can run the application using either **Option A (Zero-setup SQLite)** or **Option B (PostgreSQL with Docker)**.

### Option A: Instant Local Setup (Recommended for Quick Evaluation)

Zero dependencies required. Runs entirely within Node.js.

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Initialize SQLite Database & Seed Data**:
   ```bash
   npm run db:use-sqlite --workspace=backend
   ```
   *(This applies the schema to a local `dev.db` SQLite database and seeds 3 realistic projects with 10 tasks).*

3. **Start Both Backend and Frontend**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

### Option B: PostgreSQL with Docker Compose

If you have Docker installed:

1. **Start PostgreSQL Container**:
   ```bash
   docker compose up -d
   ```

2. **Configure Backend `.env`**:
   In `backend/.env`, set:
   ```env
   DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/task_management_db?schema=public"
   ```

3. **Run PostgreSQL Schema Push & Seed**:
   ```bash
   npm run db:use-postgres --workspace=backend
   ```

4. **Start Application**:
   ```bash
   npm run dev
   ```

---

### Option C: PostgreSQL with Local Service

If you run PostgreSQL natively on your machine:

1. Create database:
   ```sql
   CREATE DATABASE task_management_db;
   ```
2. Update `DATABASE_URL` in `backend/.env` with your username and password.
3. Run migrations and seed:
   ```bash
   npm run db:use-postgres --workspace=backend
   ```
4. Run `npm run dev`.

---

## 🗄 Database Schema & Migrations

### Entity Relationship
```
+------------------------------------+          +------------------------------------+
|             Project                |          |                Task                |
+------------------------------------+          +------------------------------------+
| id          : UUID / String (PK)   |<---+     | id          : UUID / String (PK)   |
| title       : String (NOT NULL)    |    |     | title       : String (NOT NULL)    |
| description : String (NULLABLE)    |    +-----| projectId   : UUID / String (FK)   |
| createdAt   : DateTime (DEFAULT)   | 1      N | description : String (NULLABLE)    |
| updatedAt   : DateTime (UPDATED)   |          | status      : Enum (todo,          |
+------------------------------------+          |               in_progress, done)   |
                                                | priority    : Enum (low,           |
                                                |               medium, high)        |
                                                | createdAt   : DateTime (DEFAULT)   |
                                                | updatedAt   : DateTime (UPDATED)   |
                                                +------------------------------------+
```

- **Cascade Delete**: When a `Project` is deleted, all child `Task` records are deleted automatically (`onDelete: Cascade`).
- **Indexes**: Indexes on `projectId`, `status`, and `priority` for query performance.

---

## 📡 REST API Reference

Base URL: `http://localhost:5001/api`

### Health Check
- `GET /health` - Service status & health check.

### Projects Endpoints
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/projects` | Get all projects with task statistics | - |
| `GET` | `/projects/:id` | Get single project with all tasks | - |
| `POST` | `/projects` | Create new project | `{ "title": string, "description"?: string }` |
| `PATCH` | `/projects/:id` | Update project | `{ "title"?: string, "description"?: string }` |
| `DELETE` | `/projects/:id` | Delete project (cascades to tasks) | - |

### Tasks Endpoints
| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | List tasks with filters | Query: `projectId`, `search`, `status`, `priority`, `sortBy`, `order` |
| `GET` | `/tasks/:id` | Get single task detail | - |
| `POST` | `/tasks` | Create task | Body: `{ "title": string, "description"?: string, "status"?: "todo" \| "in_progress" \| "done", "priority"?: "low" \| "medium" \| "high", "projectId": string }` |
| `PATCH` | `/tasks/:id` | Update task | Body: `{ "title"?: string, "description"?: string, "status"?: string, "priority"?: string }` |
| `DELETE` | `/tasks/:id` | Delete task | - |

### Standard Response Format

**Success (200 / 201)**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Project created successfully"
}
```

**Error (400 / 404 / 500)**:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      { "field": "title", "message": "Title cannot be empty" }
    ]
  }
}
```

---

## 📌 Assumptions & Design Decisions

1. **Monorepo Architecture**:
   - Placed frontend and backend in one repository using standard npm workspaces. This satisfies the test preference ("*satu repository monorepo direkomendasikan*") and ensures one unified command (`npm run dev`) starts the full application.
2. **Task Status & Priorities**:
   - Statuses: `todo`, `in_progress`, and `done`.
   - Priorities: `low`, `medium`, and `high`.
   - In the frontend, clicking a status button immediately updates the UI optimistically and syncs with the server. If an error occurs, it rolls back gracefully and displays an error toast.
3. **Database Portability**:
   - To make testing frictionless for the reviewers, the code is 100% compatible with both PostgreSQL and SQLite through Prisma. The PostgreSQL schema and migration scripts (`schema.postgres.prisma` and `migration.sql`) are fully provided.
4. **Input Validation**:
   - All inputs (both in frontend modals and backend controllers) enforce length limits and required fields using Zod schemas.

---

## 🧪 Testing & Quality Assurance

To verify both the backend and frontend builds:

```bash
# Build backend
npm run build --workspace=backend

# Build frontend
npm run build --workspace=frontend

# Seed database with sample data
npm run db:seed --workspace=backend
```

---

*Authored for the Web Developer Technical Assessment at Spend Group.*
