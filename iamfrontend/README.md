# IAM Frontend

Frontend application for the Internal Access Management (IAM) platform.

Built using React, TypeScript, Vite, and Tailwind CSS following enterprise frontend architecture.

---

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod
- Lucide React
- Recharts

---

## Folder Structure

```
src/
│
├── app/
│   ├── config/
│   ├── providers/
│   ├── routes/
│   └── store/
│
├── assets/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── access/
│   ├── requests/
│   ├── approvals/
│   ├── users/
│   ├── roles/
│   ├── reports/
│   ├── audit/
│   ├── monitoring/
│   ├── notifications/
│   ├── policies/
│   ├── workflow/
│   └── settings/
│
├── layouts/
│
├── shared/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── validators/
│
├── styles/
├── theme/
├── lib/
└── main.tsx
```

---

## Application Structure

```
Login
    │
Dashboard Layout
    │
├── Sidebar
├── Navbar
└── Page Content
```

The layout is shared across all authenticated pages using nested routing with `Outlet`.

---

## Libraries

| Library            | Purpose                           |
| ------------------ | --------------------------------- |
| React Router       | Client-side routing               |
| Axios              | HTTP client                       |
| TanStack Query     | API caching and server state      |
| React Hook Form    | Form state management             |
| Zod                | Validation                        |
| Hookform Resolvers | Connects Zod with React Hook Form |
| Lucide React       | Icons                             |
| Recharts           | Dashboard charts                  |
| clsx               | Conditional class names           |
| tailwind-merge     | Tailwind class merging            |

---

## Current Features

- Enterprise Folder Structure
- React Router Configuration
- Nested Routing
- Dashboard Layout
- Sidebar
- Navbar
- Shared Component Architecture

---

## Upcoming Features

### Authentication

- Login
- JWT Integration
- Protected Routes

### Dashboard

- Statistics Cards
- Charts
- Recent Activity
- Notifications

### Access Management

- Request Access
- My Access
- Approval Workflow

### Administration

- Users
- Roles
- Applications
- Policies

### Reports

- Audit Logs
- Analytics
- Export Reports

---

## Development

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build production

```bash
npm run build
```

---

## Frontend Principles

- Feature-first architecture
- Reusable UI components
- Type-safe development
- Component composition
- Responsive design
- Clean separation of concerns
- Enterprise scalability

---

## Status

Current Version

```
v0.1.0
```

Development Stage

```
Project Setup & Architecture
```
