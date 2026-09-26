import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { ToastProvider } from './context/ToastContext'
import AppRoutes from './routes/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
