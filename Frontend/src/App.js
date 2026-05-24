import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./components/shared/Login";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageStaff from "./components/admin/ManageStaff";
import AdminPatients from "./components/admin/AdminPatients";
import AdminAppointments from "./components/admin/AdminAppointments";

import DoctorLayout from "./components/doctor/DoctorLayout";
import DoctorAppointments from "./components/doctor/DoctorAppointments";

import ReceptionistLayout from "./components/receptionist/ReceptionistLayout";
import ReceptionistPatients from "./components/receptionist/ReceptionistPatients";
import ReceptionistAppointments from "./components/receptionist/ReceptionistAppointments";

// Maps each role to its home route
const roleHome = {
  admin: "/admin",
  doctor: "/doctor",
  receptionist: "/receptionist",
};

/**
 * RequireAuth — protects a route.
 * - Not logged in  → /login
 * - Wrong role     → redirect to their own home (not an error page)
 * - Correct role   → render children
 */
function RequireAuth({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role))
    return <Navigate to={roleHome[user.role] || "/login"} replace />;
  return children;
}

/** Root / → send each role straight to their dashboard */
function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleHome[user.role] || "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RoleRedirect />} />

        {/* Login — only page without auth */}
        <Route path="/login" element={<Login />} />

        {/* ── Admin only ── */}
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="staff" element={<ManageStaff />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="appointments" element={<AdminAppointments />} />
        </Route>

        {/* ── Doctor only ── */}
        <Route
          path="/doctor"
          element={
            <RequireAuth allowedRoles={["doctor"]}>
              <DoctorLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DoctorAppointments />} />
        </Route>

        {/* ── Receptionist only ── */}
        <Route
          path="/receptionist"
          element={
            <RequireAuth allowedRoles={["receptionist"]}>
              <ReceptionistLayout />
            </RequireAuth>
          }
        >
          <Route index element={<ReceptionistPatients />} />
          <Route path="appointments" element={<ReceptionistAppointments />} />
        </Route>

        {/* Any unknown URL → role redirect (or login) */}
        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}