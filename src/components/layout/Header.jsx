import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Flame, Coins } from 'lucide-react'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Dropdown, DropdownItem, DropdownDivider } from '../common/Dropdown'

export function Header({
  onMobileMenuOpen,
  user,
}) {
  const navigate = useNavigate()

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-[#E8E8E5] bg-[#FAFAF9]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#111111] hover:bg-[#F4F4F1]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#6B6B6B]">
          <span className="font-medium text-[#111111]">Placement Command Center</span>
          <span>•</span>
          <span>Target: {user?.targetRole || 'Software Engineer'}</span>
        </div>
      </div>

      {/* Right: Credits, Readiness, Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Credits Badge */}
        <Link to="/billing">
          <Badge variant="neutral" size="md" className="cursor-pointer hover:border-[#D0D0CB] transition-colors">
            <Coins className="w-3.5 h-3.5 text-[#D95B14]" />
            <span className="font-semibold text-[#111111]">{user?.credits || 150}</span>
            <span className="text-[#8E8E8E] hidden sm:inline">credits</span>
          </Badge>
        </Link>

        {/* Readiness Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E8E8E5] text-xs">
          <Flame className="w-3.5 h-3.5 text-[#D95B14]" />
          <span className="text-[#6B6B6B]">Readiness:</span>
          <span className="font-semibold text-[#111111]">{user?.placementReadiness || 68}%</span>
        </div>

        {/* Start Interview CTA */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/interview')}
          className="hidden sm:inline-flex"
        >
          Start Practice
        </Button>

        {/* User Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-medium text-xs hover:ring-2 hover:ring-[#111111]/20 transition-all cursor-pointer">
              {user?.name ? user.name.charAt(0) : 'S'}
            </div>
          }
        >
          {({ close }) => (
            <>
              <div className="px-3.5 py-2">
                <p className="text-xs font-semibold text-[#111111] truncate">{user?.name}</p>
                <p className="text-[11px] text-[#6B6B6B] truncate">{user?.email}</p>
              </div>
              <DropdownDivider />
              <DropdownItem
                onClick={() => {
                  navigate('/profile')
                  close()
                }}
              >
                Profile Overview
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  navigate('/settings')
                  close()
                }}
              >
                Account Settings
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  navigate('/billing')
                  close()
                }}
              >
                Credits & Billing
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                onClick={() => {
                  navigate('/')
                  close()
                }}
                danger
              >
                Return to Landing
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>
    </header>
  )
}

export default Header
