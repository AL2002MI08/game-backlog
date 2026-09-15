import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { RouteLinks } from "@/constants/routes";
import Spinner from "@/components/ui/Spinner";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={RouteLinks.Login} replace />;
  }

  return <Outlet />;
}