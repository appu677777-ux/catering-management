import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CaptainDashboard from "./pages/captain/CaptainDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateEvent from "./pages/admin/CreateEvent";
import EditEvent from "./pages/admin/EditEvent";


export default function AppRoutes() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === "admin") navigate("/admin");
            if (user.role === "captain") navigate("/captain");
            if (user.role === "user") navigate("/user");
        }
    }, [user]);

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
  path="/register"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Register />
    </ProtectedRoute>
  }
/>

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/captain"
                element={
                    <ProtectedRoute allowedRoles={["captain"]}>
                        <CaptainDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/create-event"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <CreateEvent />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/edit-event/:id"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <EditEvent />
                    </ProtectedRoute>
                }
            />
            
        </Routes>
    );
}