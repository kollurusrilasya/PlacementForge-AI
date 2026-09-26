import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { ToastProvider } from './context/ToastContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import AppRoutes from './routes/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <UserProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </UserProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
