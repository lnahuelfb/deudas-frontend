import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import Providers from '@app/providers/queryProvider'
import { registerSW } from 'virtual:pwa-register'

import { router } from './app/router/router.tsx'
import { Analytics } from "@vercel/analytics/react"
import './index.css'

// Register Service Worker
registerSW({
  onNeedRefresh() {
    // You can notify user about the new version
  },
  onOfflineReady() {
    // You can notify user that the app is ready for offline use
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
      <Analytics />
    </Providers>
  </StrictMode>,
)
