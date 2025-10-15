import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token) {
    // Redirect to login and remember where user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
