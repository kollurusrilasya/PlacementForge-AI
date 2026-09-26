import React from 'react'
import { cn } from '../../utils/cn'

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  ...props
}) {
  const base = 'inline-flex items-center font-medium rounded-full tracking-tight'

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2',
  }

  const variants = {
    neutral: 'bg-[#F4F4F1] text-[#4A4A4A] border border-[#E8E8E5]',
    accent: 'bg-[#FFF5EE] text-[#D95B14] border border-[#FCD6BF]',
    success: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
    warning: 'bg-[#FEFCE8] text-[#A16207] border border-[#FEF08A]',
    danger: 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]',
    dark: 'bg-[#111111] text-white border border-[#2A2A28]',
  }

  const dotColors = {
    neutral: 'bg-[#8E8E8E]',
    accent: 'bg-[#D95B14]',
    success: 'bg-[#16A34A]',
    warning: 'bg-[#CA8A04]',
    danger: 'bg-[#DC2626]',
    dark: 'bg-white',
  }

  return (
    <span className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      <span>{children}</span>
    </span>
  )
}

export function ProgressIndicator({
  value = 0,
  max = 100,
  label,
  sublabel,
  showPercentage = true,
  size = 'md',
  variant = 'accent',
  className,
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  const fills = {
    accent: 'bg-[#D95B14]',
    dark: 'bg-[#111111]',
    success: 'bg-[#16A34A]',
  }

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-[#111111]">{label}</span>
          <div className="flex items-center gap-1.5">
            {sublabel && <span className="text-[#6B6B6B]">{sublabel}</span>}
            {showPercentage && (
              <span className="font-semibold text-[#111111] tabular-nums">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-[#E8E8E5] rounded-full overflow-hidden',
          heights[size]
        )}
      >
        <div
          className={cn('h-full transition-all duration-300 rounded-full', fills[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default Badge
