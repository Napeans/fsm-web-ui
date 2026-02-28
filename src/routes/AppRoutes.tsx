import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import LeadCreate from "../features/leads/LeadCreate";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/lead-create"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LeadCreate />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;