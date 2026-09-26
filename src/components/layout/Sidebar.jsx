import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  FileCheck2,
  Video,
  Map,
  CreditCard,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import BrandLogo from '../common/BrandLogo'
import { useToast } from '../../context/ToastContext'

const NAV_ITEMS = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Resume Builder', path: '/resume', icon: FileText },
  { label: 'Resume Scorer', path: '/resume/scorer', icon: FileCheck2 },
  { label: 'AI Interview', path: '/interview', icon: Video },
  { label: 'Career Roadmap', path: '/roadmap', icon: Map },
  { label: 'Billing', path: '/billing', icon: CreditCard },
]

export function Sidebar({
  isOpen,
  onToggle,
  isMobileOpen,
  onMobileClose,
  user,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = () => {
    toast.show('Signed out from demo session', { type: 'info' })
    navigate('/')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FAFAF9] border-r border-[#E8E8E5]">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E8E8E5]">
        <NavLink to="/dashboard" className="flex items-center">
          <BrandLogo collapsed={!isOpen} />
        </NavLink>
        <button
          onClick={onToggle}
          className="hidden md:flex w-7 h-7 rounded-lg items-center justify-center text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F4F4F1] transition-colors"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path)

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs sm:text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#111111] text-white shadow-subtle'
                  : 'text-[#555555] hover:text-[#111111] hover:bg-[#F0F0EC]',
                !isOpen && 'justify-center px-0'
              )}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-[#6B6B6B]')} />
              {isOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </div>

      {/* Bottom User & Settings Area */}
      <div className="p-3 border-t border-[#E8E8E5] space-y-1 bg-[#F4F4F1]/60">
        <NavLink
          to="/profile"
          onClick={onMobileClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs sm:text-sm font-medium text-[#555555] hover:text-[#111111] hover:bg-[#F0F0EC] transition-colors',
            !isOpen && 'justify-center px-0',
            location.pathname === '/profile' && 'bg-white text-[#111111] shadow-subtle'
          )}
          title={!isOpen ? 'Profile' : undefined}
        >
          <User className="w-4 h-4 text-[#6B6B6B]" />
          {isOpen && <span>Profile</span>}
        </NavLink>

        <NavLink
          to="/settings"
          onClick={onMobileClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs sm:text-sm font-medium text-[#555555] hover:text-[#111111] hover:bg-[#F0F0EC] transition-colors',
            !isOpen && 'justify-center px-0',
            location.pathname === '/settings' && 'bg-white text-[#111111] shadow-subtle'
          )}
          title={!isOpen ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 text-[#6B6B6B]" />
          {isOpen && <span>Settings</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors',
            !isOpen && 'justify-center px-0'
          )}
          title={!isOpen ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4" />
          {isOpen && <span>Logout</span>}
        </button>

        {user && isOpen && (
          <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-[#6B6B6B]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">{user.name}</span>
            </div>
            <span className="font-semibold text-[#111111]">{user.placementReadiness}%</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={cn(
          'hidden md:block shrink-0 transition-all duration-200 z-20 h-screen sticky top-0',
          isOpen ? 'w-60' : 'w-16'
        )}
      >
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 z-50 md:hidden transition-transform duration-200 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
