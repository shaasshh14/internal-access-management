import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import AccessPage from "../../features/dashboard/pages/AccessPage";
import UsersPage from "../../features/dashboard/pages/UsersPage";
import RequestPage from "../../features/dashboard/pages/RequestsPage";
import AuditPage from "../../features/dashboard/pages/AuditPage";
import SettingsPage from "../../features/dashboard/pages/SettingsPage";

function LoginPage() {
  return <h1>Login</h1>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
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

        {/* Unidentified Route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}