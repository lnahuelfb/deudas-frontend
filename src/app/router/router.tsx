import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@layouts/AppLayout'

import Login from '@pages/Login'
import Register from '@pages/Register'
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
        element: <div>Dashboard</div>
      },
      {
        path: "/profile",
        element: <div>Perfil</div>
      },
      {
        path: "/debts",
        element: <div>Deudas</div>
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