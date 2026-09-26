import React from 'react'
import { cn } from '../../utils/cn'

export function BrandLogo({
  size = 'md',
  showTagline = false,
  collapsed = false,
  className,
}) {
  const iconSizes = {
    sm: 'w-6 h-6 rounded-lg text-xs',
    md: 'w-7 h-7 rounded-[8px] text-sm',
    lg: 'w-9 h-9 rounded-[10px] text-base',
  }

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {/* Refined Geometric Forge Mark */}
      <div
        className={cn(
          'relative flex items-center justify-center bg-[#111111] text-white shrink-0 shadow-subtle',
          iconSizes[size]
        )}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Anvil Base */}
          <path
            d="M4 17H20V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V17Z"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
          {/* Forge Body */}
          <path
            d="M7 11L5 17H19L17 11H7Z"
            fill="#FFFFFF"
            fillOpacity="0.4"
          />
          {/* Amber Spark / Flame Accent */}
          <path
            d="M12 4C12 4 15 7.5 15 9.5C15 11.1569 13.6569 12.5 12 12.5C10.3431 12.5 9 11.1569 9 9.5C9 7.5 12 4 12 4Z"
            fill="#D95B14"
          />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-[#111111]">
              Placement Forge
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F4F4F1] text-[#6B6B6B] border border-[#E8E8E5]">
              AI
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] text-[#6B6B6B] -mt-0.5">
              Forge Your Path. Crack Your Placement.
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default BrandLogo
