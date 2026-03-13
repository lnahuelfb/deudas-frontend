import { createBrowserRouter } from 'react-router-dom'

import Login from '@pages/Login'
import Register from '@pages/Register'
import App from '@/App'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
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