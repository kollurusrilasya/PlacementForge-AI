import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'

export function Dropdown({
  trigger,
  children,
  align = 'left',
  className,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const alignStyles = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute mt-2 min-w-[200px] rounded-[12px] bg-white border border-[#E8E8E5] shadow-dropdown z-30 py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-100',
            alignStyles[align],
            className
          )}
        >
          {typeof children === 'function' ? children({ close: () => setIsOpen(false) }) : children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  icon: Icon,
  danger = false,
  disabled = false,
  className,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-colors',
        danger
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-[#111111] hover:bg-[#F4F4F1]',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 opacity-70" />}
      <span>{children}</span>
    </button>
  )
}

export function DropdownDivider() {
  return <div className="h-px bg-[#E8E8E5] my-1" />
}

export default Dropdown
