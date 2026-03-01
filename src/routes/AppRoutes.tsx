import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import LeadCreate from "../features/leads/LeadCreate";
import LeadsList from "../features/leads/LeadsList";
import JobsList from "../features/jobs/JobsList";
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

      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LeadsList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <JobsList />
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
