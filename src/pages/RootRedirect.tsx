import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { RouteLinks } from "@/constants/routes";
import Spinner from "@/components/ui/Spinner";

export default function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  return <Navigate to={isAuthenticated ? RouteLinks.GameOverview : RouteLinks.Login} replace />;
}
