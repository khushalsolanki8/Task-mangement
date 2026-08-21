# Task Management System — Full Stack Technical Assessment

A full-stack, enterprise-grade Task Management application built to fulfill the technical assessment requirements based on the provided [Figma Design Template](https://www.figma.com/design/obONCFmoTFN27V5H9PHS2X/Assessment-Task?node-id=0-1).

The application features a responsive **Next.js 15 App Router** frontend paired with a modular **NestJS REST API** backend, powered by **Prisma ORM** and **PostgreSQL**.

---

## 🚀 1. Project Overview

The Task Management System enables users to manage task pipelines across Kanban board columns (`To Do`, `Doing`, `Completed`, `On Hold`, `User Feedback`) and Data Table views. It includes instant Guest Authentication, real-time live search filtering, customizable field visibility, inline priority/status updating, detailed task drawers with subtasks and activity logs, and a dynamic 0ms anti-flicker theme engine (Light/Dark mode + 6 accent color themes).

---

## ✨ 2. Features

* **Guest Login**: One-click instant guest authentication generating transient user sessions.
* **Dual View Modes**: Segmented toggle between **Kanban Board** multi-column lanes and structured **Data Table List View**.
* **Task Management (CRUD)**: Create, view, update status/priority/due dates/labels, and delete tasks.
* **Task Detail Modal**: Full task detail drawer featuring description, subtasks table, resource links, and interactive activity/comment feed.
* **Projects Management**: Active workspace project pipeline listing with task counters and leads.
* **Live Search & Filtering**: Real-time client-side and server-side text search across task titles, descriptions, and category labels.
* **Field Customization**: Popover menu to toggle visibility of card/table fields (Priority, Members, Due Date, Status, Reporter, Labels).
* **Flicker-Free Dark/Light Mode**: Anti-FOUC theme switching (Light/Dark mode) with 6 dynamic accent color themes (`Blue`, `Amber`, `Pink`, `Rose`, `Emerald`, `Black`).
* **Profile & Workspace Settings**: Manage profile details (Name, Email, Job Title, Username) and workspace removal confirmation modal.
* **Fully Responsive**: Optimized UI scaling seamlessly across Desktop (1440px+), Tablet (768px-1024px), and Mobile (<768px with drawer navigation).

---

## 🛠️ 3. Tech Stack

### Frontend
* **Framework**: Next.js 15 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4 & Custom CSS Variables Design Tokens
* **Icons**: Lucide React
* **State & Hooks**: React Context API & Custom Hooks (`useTasks`, `useAuth`, `useTheme`)

### Backend
* **Framework**: NestJS (Node.js)
* **Language**: TypeScript
* **ORM**: Prisma ORM
* **Database**: PostgreSQL
* **Auth**: Passport.js & JWT (`@nestjs/jwt`)
* **Validation**: `class-validator` & `class-transformer`

---

## 📐 4. Architecture

```text
┌─────────────────────────┐               ┌─────────────────────────┐
│     Next.js Frontend    │               │      NestJS Backend     │
│   (Next.js 15 / React)  │               │   (REST APIs / Guards)  │
└────────────┬────────────┘               └────────────┬────────────┘
             │                                         │
             │ HTTP REST Requests                      │ Prisma ORM
             ▼                                         ▼
┌─────────────────────────┐               ┌─────────────────────────┐
│   Services & Hooks      │               │       PostgreSQL        │
│  (api.ts / useTasks)    │               │  (Relational Database)  │
└─────────────────────────┘               └─────────────────────────┘
```

The system uses a decoupled client-server architecture:
* **Frontend**: Next.js App Router renders pages client-side using custom hooks for state management and an API service wrapper (`src/services/api.ts`) for HTTP requests.
* **Backend**: NestJS handles request routing (`Controllers`), input validation (`ValidationPipe` + DTOs), business logic (`Services`), and database queries (`PrismaService`).

---

## 📁 5. Project Structure

```text
task-mangement/
├── backend/                         # NestJS Backend Application
│   ├── prisma/
│   │   └── schema.prisma            # Prisma PostgreSQL schema
│   ├── src/
│   │   ├── app.module.ts            # Root module
│   │   ├── main.ts                  # NestJS main entry, CORS & ValidationPipe
│   │   ├── auth/                    # AuthModule (Guest login, JWT strategy, Guards)
│   │   ├── prisma/                  # PrismaModule & PrismaService
│   │   ├── tasks/                   # TasksModule (CRUD controllers & services)
│   │   └── users/                   # UsersModule (Profile endpoints)
│   ├── .env                         # Backend environment variables
│   └── package.json
│
├── src/                             # Next.js Frontend Application
│   ├── app/
│   │   ├── globals.css              # Design system tokens & CSS variables
│   │   ├── layout.tsx               # Root layout with head script & ThemeProvider
│   │   └── page.tsx                 # Main dashboard orchestrator
│   ├── components/
│   │   ├── auth/                    # LoginPage (Figma Frame 1)
│   │   ├── ui/                      # Reusable primitives (Button, Input, Modal, Card, etc.)
│   │   ├── layout/                  # Shell layout (Sidebar, Header, AppLayout, MobileNav)
│   │   ├── task/                    # KanbanBoard, TaskCard, ListView, TaskDetailModal
│   │   ├── project/                 # ProjectsView table
│   │   └── settings/                # SettingsView profile form
│   ├── hooks/                       # Custom React hooks (useTasks, useAuth)
│   ├── services/                    # API Service layer (api.ts)
│   ├── types/                       # TypeScript interfaces
│   └── data/                        # Initial mock data fallback
├── package.json
└── tsconfig.json
```

---

## 🗄️ 6. Database Schema

The database consists of **5 minimal relational tables**:

```prisma
enum TaskStatus   { TODO, DOING, COMPLETED, ON_HOLD, USER_FEEDBACK }
enum TaskPriority { NO_PRIORITY, URGENT, HIGH, MEDIUM, LOW }

model User {
  id          String   @id @default(uuid())
  email       String?  @unique
  name        String
  password    String?
  isGuest     Boolean  @default(false)
  themeMode   String   @default("light")
  accentColor String   @default("blue")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Task {
  id          String       @id @default(uuid())
  title       String
  description String?      @db.Text
  status      TaskStatus   @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  labels      String[]     @default([])
  projectId   String?
  reporterId  String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

---

## 🔐 7. Authentication

* **Guest Login**: Clicking "Continue as Guest" triggers `POST /api/auth/guest-login`, which creates a transient `User` row (`isGuest: true`) and returns a signed JWT access token.
* **Token Storage**: The JWT token is saved in `localStorage` under `auth_token` and attached as a `Bearer` header on outgoing requests.
* **NestJS Guards**: Protected routes (`/api/tasks`, `/api/users/me`) are guarded by `JwtAuthGuard` and `JwtStrategy`.
* **Session Persistence**: On page load, `useAuth` validates the token via `/api/users/me`. If invalid (401), the token is cleared and the user is routed to the Login page.

---

## 📡 8. API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/guest-login` | Generates a guest session token | No |
| `POST` | `/api/auth/register` | Registers a new user account | No |
| `POST` | `/api/auth/login` | Authenticates existing user | No |
| `GET` | `/api/users/me` | Fetches current user profile | Yes |
| `PATCH` | `/api/users/me` | Updates user preferences/profile | Yes |
| `GET` | `/api/tasks` | Retrieves tasks (supports `search`, `status`, `priority`) | Yes |
| `POST` | `/api/tasks` | Creates a new task | Yes |
| `GET` | `/api/tasks/:id` | Retrieves a single task by ID | Yes |
| `PATCH` | `/api/tasks/:id` | Updates task status, priority, or details | Yes |
| `DELETE` | `/api/tasks/:id` | Deletes a task by ID | Yes |

---

## 🔑 9. Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskdb?schema=public"
JWT_SECRET="super-secret-jwt-key-task-management-2026"
CORS_ORIGIN="http://localhost:3000"
```

---

## 💻 10. Local Installation & Setup

### Prerequisites
* Node.js v18+ or v20+
* npm or pnpm
* PostgreSQL database instance running locally or via Docker

---

### 11. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env`.
4. Run Prisma database migrations and generate client:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
5. Start the NestJS backend dev server:
   ```bash
   npm run start:dev
   ```
   *Backend API will run at `http://localhost:5000/api`*

---

### 12. Frontend Setup
1. Navigate to the root folder:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js dev server:
   ```bash
   npm run dev
   ```
   *Frontend application will run at `http://localhost:3000`*

---

## 🌐 15. Live Demo & 16. Repository

* **GitHub Repository**: `https://github.com/your-username/task-management-system`
* **Live Demo**: `http://localhost:3000`

---

## 📸 17. Screenshots

*(Replace placeholder links with captured application screenshots)*
* **Kanban Board View**: `![Board View](docs/board-view.png)`
* **List View**: `![List View](docs/list-view.png)`
* **Task Details Modal**: `![Task Details](docs/task-details.png)`
* **Dark Mode & Accent Colors**: `![Dark Mode](docs/dark-mode.png)`

---

## 💡 18. Design Decisions & 19. Intentional Figma Deviations

* **Deduplicated Fields Label**: The Figma frame contained a duplicate "Members" checkbox in the Fields popover. This was deduplicated in the code implementation.
* **Anti-FOUC Theme Script**: To prevent dark mode flickering during Next.js client hydration, a synchronous inline script was added to `<head>` inside `layout.tsx`.
* **Optimistic Local Fallbacks**: To ensure a smooth demonstration during offline evaluations, the frontend service includes local fallback state handling if the PostgreSQL backend connection is unfulfilled.

---

## 🔮 20. Future Improvements

* Real-time WebSocket task status updates using `@nestjs/websockets` / Socket.io.
* Drag-and-drop Kanban column reordering using `@hello-pangea/dnd`.
* Advanced File Upload integration (AWS S3) for task attachments.

---

## 👤 21. Author

* **Khushal Solanki**  
* **Role**: Full Stack Developer Assessment  
