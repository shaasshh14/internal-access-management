import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";

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

        </Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}