import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CaptainDashboard from "./pages/captain/CaptainDashboard";
import UserDashboard from "./pages/user/UserDashboard";

import CreateEvent from "./pages/admin/CreateEvent";
import EditEvent from "./pages/admin/EditEvent";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEventDetails from "./pages/admin/AdminEventDetails";
import AdminPaymentPage from "./pages/admin/AdminPaymentPage";
import AdminPaymentDetails from "./components/admin/AdminPaymentDetails";

import CaptainPaymentPage from "./pages/captain/CaptainPaymentPage";

// Components
import ProtectedRoute from "./routes/ProtectedRoute";
import Preloader from "./components/Preloader";

export default function AppRoutes() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Preloader
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 🔀 Auto Redirect by Role
  useEffect(() => {
    if (!user) return;

    const roleRoutes = {
      admin: "/admin",
      captain: "/captain",
      user: "/user"
    };

    navigate(roleRoutes[user.role] || "/");
  }, [user]);

  // 🔐 Reusable Protected Wrapper
  const protect = (roles, component) => (
    isLoading
      ? <Preloader />
      : <ProtectedRoute allowedRoles={roles}>{component}</ProtectedRoute>
  );

  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Login />} />

      {/* ADMIN ROUTES */}
      <Route path="/register" element={protect(["admin"], <Register />)} />
      <Route path="/admin" element={protect(["admin"], <AdminDashboard />)} />
      <Route path="/admin/create-event" element={protect(["admin"], <CreateEvent />)} />
      <Route path="/admin/edit-event/:id" element={protect(["admin"], <EditEvent />)} />
      <Route path="/admin/users" element={protect(["admin"], <AdminUsers />)} />
      <Route path="/admin/event/:id" element={protect(["admin"], <AdminEventDetails />)} />
      <Route path="/admin/payments" element={protect(["admin"], <AdminPaymentPage />)} />
      <Route path="/admin/payments/:id" element={protect(["admin"], <AdminPaymentDetails />)} />

      {/* CAPTAIN ROUTES */}
      <Route path="/captain" element={protect(["captain"], <CaptainDashboard />)} />
      <Route path="/captain/payments" element={protect(["captain"], <CaptainPaymentPage />)} />

      {/* USER ROUTES */}
      <Route path="/user" element={protect(["user"], <UserDashboard />)} />

    </Routes>
  );
}