import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Games from "@/pages/Games";
import GameDetails from "@/pages/GameDetail";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import RootRedirect from "@/pages/RootRedirect";
import { RouteLinks } from "@/constants/routes";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: RouteLinks.Root,
    element: <RootRedirect />,
  },
  {
    path: RouteLinks.Login,
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            path: RouteLinks.GameOverview,
            element: <Games />
          },
          {
            path: RouteLinks.Game,
            element: <GameDetails />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);
