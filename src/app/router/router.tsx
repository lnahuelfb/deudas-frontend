import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";

// Lazy Loading de páginas
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const DebtsPage = lazy(() => import("@/pages/Debt"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Settings = lazy(() => import("@/pages/Settings"));
const Landing = lazy(() => import("@/pages/Landing"));

// Componente de carga sutil (solo un fondo del color de la app)
const PageLoader = () => <div className="min-h-screen bg-[#1e1b4b]" />;

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Landing />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Register />
      </Suspense>
    ),
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "/debts",
        element: (
          <Suspense fallback={<PageLoader />}>
            <DebtsPage />
          </Suspense>
        ),
      },
      {
        path: "/settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
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