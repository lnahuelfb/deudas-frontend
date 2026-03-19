import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@layouts/AppLayout'

import Login from '@pages/Login'
import Register from '@pages/Register'
import Dashboard from "@/pages/Dashboard"
import Debt from "@/pages/Debt"
import App from '@/App'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <App />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/profile",
        element: <div>Perfil</div>
      },
      {
        path: "/debts",
        element: <Debt />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);