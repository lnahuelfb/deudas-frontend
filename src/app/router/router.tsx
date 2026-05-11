import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import DebtsPage from "@/pages/Debt";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Settings from "@/pages/Settings";
import Landing from "@/pages/Landing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/debts",
        element: <DebtsPage />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      // Redirección si intentan ir a / y están en el layout (opcional)
      {
        path: "/home",
        element: <Navigate to="/dashboard" replace />,
      }
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);