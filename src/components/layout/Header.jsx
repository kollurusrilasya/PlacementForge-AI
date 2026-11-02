
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Flame, Coins } from 'lucide-react'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Dropdown, DropdownItem, DropdownDivider } from '../common/Dropdown'
import { apiRequest } from '../../services/api'
import { useUser } from '../../context/UserContext'
import { INITIAL_USER } from '../../data/initialMockData'

export function Header({
  onMobileMenuOpen,
  user,
}) {
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleLogout = () => {
    localStorage.removeItem('placement_forge_token')
    localStorage.removeItem('placement_forge_user')

    setUser(INITIAL_USER)

    navigate('/')
  }

  const [targetRole, setTargetRole] = useState(null)
  const [readiness, setReadiness] = useState(null)

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        const data = await apiRequest('/api/skill-gap')
        const skillGap = data.skillGap

        if (skillGap) {
          setTargetRole(skillGap.targetRole || null)

          const required = skillGap.requiredSkills || []
          const missing = skillGap.missingSkills || []

          if (required.length > 0) {
            const matched = required.length - missing.length
            setReadiness(Math.round((matched / required.length) * 100))
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard header data:', error.message)
      }
    }

    fetchSkillGap()
  }, [])

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-[#E8E8E5] bg-[#FAFAF9]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
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
          <span>Target: {targetRole || 'Not selected'}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/billing">
          <Badge variant="neutral" size="md" className="cursor-pointer hover:border-[#D0D0CB] transition-colors">
            <Coins className="w-3.5 h-3.5 text-[#D95B14]" />
            <span className="font-semibold text-[#111111]">{user?.credits ?? 150}</span>
            <span className="text-[#8E8E8E] hidden sm:inline">credits</span>
          </Badge>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E8E8E5] text-xs">
          <Flame className="w-3.5 h-3.5 text-[#D95B14]" />
          <span className="text-[#6B6B6B]">Readiness:</span>
          <span className="font-semibold text-[#111111]">
            {readiness !== null ? `${readiness}%` : '--'}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/interview')}
          className="hidden sm:inline-flex"
        >
          Start Practice
        </Button>

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
              <DropdownItem onClick={() => {
                navigate('/profile')
                close()
              }}>
                Profile Overview
              </DropdownItem>
              <DropdownItem onClick={() => {
                navigate('/settings')
                close()
              }}>
                Account Settings
              </DropdownItem>
              <DropdownItem onClick={() => {
                navigate('/billing')
                close()
              }}>
                Credits & Billing
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
  onClick={() => {
    handleLogout()
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
