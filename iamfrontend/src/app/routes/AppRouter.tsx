import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import AccessPage from "../../features/access/pages/AccessPage";
import UsersPage from "../../features/users/pages/UsersPage";
import UserDetailPage from "../../features/users/pages/UserDetailPage";
import ApplicationsPage from "../../features/applications/pages/ApplicationsPage";
import ApplicationDetailPage from "../../features/applications/pages/ApplicationDetailPage";
import RequestsPage from "../../features/requests/pages/RequestsPage";
import RequestDetailPage from "../../features/requests/pages/RequestDetailPage";
import RolesPage from "../../features/roles/pages/RolesPage";
import RoleDetailPage from "../../features/roles/pages/RoleDetailPage";
import AuditPage from "../../features/audit/pages/AuditPage";
import SettingsPage from "../../features/settings/pages/SettingsPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import NotFoundPage from "../../features/notFound/pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/access"
              element={<AccessPage />}
            />

            <Route
              path="/users"
              element={<UsersPage />}
            />
            <Route
              path="/users/:id"
              element={<UserDetailPage />}
            />

            <Route
              path="/applications"
              element={<ApplicationsPage />}
            />
            <Route
              path="/applications/:id"
              element={<ApplicationDetailPage />}
            />

            <Route
              path="/requests"
              element={<RequestsPage />}
            />
            <Route
              path="/requests/:id"
              element={<RequestDetailPage />}
            />

            <Route
              path="/roles"
              element={<RolesPage />}
            />
            <Route
              path="/roles/:id"
              element={<RoleDetailPage />}
            />

            <Route
              path="/audit"
              element={<AuditPage />}
            />

            <Route
              path="/settings"
              element={<SettingsPage />}
            />

          </Route>
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 - Unidentified Route */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}
