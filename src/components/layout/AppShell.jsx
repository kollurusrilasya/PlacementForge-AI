
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useUser } from '../../context/UserContext'
import { ErrorBoundary } from '../common/ErrorBoundary'

export function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user } = useUser()

  return (
    <div className="h-screen overflow-hidden bg-[#FAFAF9] flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <Header
          user={user}
          setIsMobileOpen={setIsMobileOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default AppShell
