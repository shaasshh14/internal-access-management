import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";

function LoginPage() {
    return <h1>Login</h1>;
}

function DashboardPage() {
    return <h1>Dashboard</h1>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* Enables routing */}
      <Routes>
        {/* Redirect "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard page */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}