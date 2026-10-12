# Internal Access Management (IAM)

An enterprise-oriented full-stack application for managing employee identities, application access, access requests, approval workflows, roles, permissions, and audit trails through a centralized platform.

Built using **React, TypeScript, and Spring Boot**, IAM follows a feature-first architecture with reusable UI components, modular services, and a clear separation of concerns. The project focuses on maintainable code, secure access control, and scalable application design.

---

## Project Overview

The application consists of two independently developed components:

- **`iamfrontend/`** — React-based frontend for the IAM dashboard and access management workflows.
- **`iambackend/`** — Spring Boot REST API for business logic, authentication, authorization, and data persistence.

Frontend features can use mock services during development and integrate with backend APIs as the corresponding functionality becomes available.

## Tech Stack

### Frontend
- React 19 and TypeScript
- Vite
- Tailwind CSS v4
- React Router
- TanStack Query
- Axios
- React Hook Form and Zod
- Lucide React
- Recharts

### Backend
- Java and Spring Boot
- Spring Security
- Spring Data JPA and Hibernate
- PostgreSQL
- Flyway
- Lombok
- MapStruct
- Bean Validation

## Core Features

- **Dashboard:** Overview of access activity, pending requests, and key statistics.
- **Authentication:** Login, identity retrieval, and authenticated application access.
- **User Management:** Employee directory, user profiles, and assigned access.
- **Application Management:** Centralized application directory and application-role mappings.
- **Access Requests:** Request, modify, track, and revoke application access.
- **Approval Workflows:** Request review, approval decisions, and status tracking.
- **Role & Permission Management:** Define roles and manage application permissions.
- **Audit Logs:** Track access-related activities and administrative actions.

*Features are being developed incrementally. The availability of individual workflows depends on the current implementation.*

## Architecture

The frontend uses a service-oriented approach to separate UI components from API communication. TanStack Query manages server-state interactions, while Axios handles HTTP requests.

The backend follows a layered architecture that separates REST controllers, business logic, data access, and persistence.

```text
React + TypeScript
        |
   React Router
        |
   Feature Modules
        |
   TanStack Query
        |
      Axios
        |
  Spring Boot REST API
        |
     Controllers
        |
      Services
        |
    Repositories
        |
     PostgreSQL
```

Mock services enable independent frontend development while backend endpoints are implemented and integrated.

## Project Structure

```text
Internal_Access_Management/
├── iamfrontend/       # React + TypeScript frontend
├── iambackend/        # Spring Boot backend
└── README.md
```

## Development Status

- Frontend project setup and application architecture established.
- Dashboard layout, routing, and reusable UI component structure established.
- Dashboard interface and feature modules under development.
- Spring Boot backend and authentication integration in progress.
- Access management workflows and API integrations being implemented incrementally.

## Design Principles

- **Feature-first architecture:** Organize code around application features.
- **Separation of concerns:** Keep presentation, business logic, API communication, and persistence distinct.
- **Reusability:** Build consistent UI components and reusable services.
- **Type safety:** Use TypeScript and validation to improve reliability.
- **Security by design:** Enforce authentication and authorization on the backend.
- **Maintainability:** Follow clean code practices and established software engineering principles.
- **Incremental development:** Integrate features progressively without unnecessary architectural complexity.

## Getting Started

### Prerequisites
- Node.js and npm
- Java and Maven
- PostgreSQL

### Frontend

```bash
cd iamfrontend
npm install
npm run dev
```

Vite will provide the local development URL in the terminal.

### Backend

Navigate to `iambackend`, configure the PostgreSQL connection and required environment variables, and run the Spring Boot application through Maven or your preferred Java IDE.

Ensure the database is running and the configured connection details match your local environment.

---

## Author

**Shashank Tiwari**  
Army Institute of Technology, Pune  
B.E. Information Technology
