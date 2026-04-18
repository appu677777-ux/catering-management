import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // Role check
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
