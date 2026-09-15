import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Games from "@/pages/Games";
import GameDetails from "@/pages/GameDetail";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <RootLayout />,

    children: [
      {
        path: "/games",
        element: <Games />
      },
      {
        path: "/games/:id",
        element: <GameDetails />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
