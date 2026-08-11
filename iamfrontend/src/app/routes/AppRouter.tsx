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
import RequestPage from "../../features/requests/pages/RequestsPage";
import AuditPage from "../../features/audit/pages/AuditPage";
import SettingsPage from "../../features/settings/pages/SettingsPage";
import LoginPage from "../../features/auth/pages/LoginPage";
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
              path="/requests"
              element={<RequestPage />}
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

        {/* Unidentified Route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}