// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { isAuthed } = useAuth();
  const loc = useLocation();
  return isAuthed ? <Outlet /> : <Navigate to="/signin" replace state={{ from: loc }} />;
}
