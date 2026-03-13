import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import AdminDashboard from "../features/dashboard/AdminDashboard";
import LeadCreate from "../features/leads/LeadCreate";
import LeadsList from "../features/leads/LeadsList";
import JobsList from "../features/jobs/JobsList";
import UserManagement from "../features/users/UserManagement";
import LandingPage from "../features/marketing/LandingPage";
import PrivacyPolicy from "../features/marketing/PrivacyPolicy";
import TermsConditions from "../features/marketing/TermsConditions";
import RefundPolicy from "../features/marketing/RefundPolicy";
import DataSecurity from "../features/marketing/DataSecurity";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />

      <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        }
      />

      <Route
        path="/register"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthLayout>
              <Register />
            </AuthLayout>
          )
        }
      />

      <Route path="/policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/data-security" element={<DataSecurity />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/user-management"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UserManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Fallback */}
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
};

export default AppRoutes;
