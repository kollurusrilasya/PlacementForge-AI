import React from 'react'
import { cn } from '../../utils/cn'

export function Card({
  children,
  className,
  hoverable = false,
  variant = 'light',
  ...props
}) {
  const base = 'rounded-[14px] transition-all duration-200'

  const variants = {
    light: 'bg-white border border-[#E8E8E5] text-[#111111]',
    muted: 'bg-[#F4F4F1] border border-[#E8E8E5] text-[#111111]',
    dark: 'bg-[#111111] border border-[#2A2A28] text-white',
    darkElevated: 'bg-[#1A1A1A] border border-[#2E2E2C] text-white',
    outline: 'bg-transparent border border-[#E8E8E5] text-[#111111]',
  }

  const hoverStyle = hoverable
    ? variant === 'dark' || variant === 'darkElevated'
      ? 'hover:border-[#40403E] hover:-translate-y-0.5'
      : 'hover:border-[#D0D0CB] hover:shadow-card hover:-translate-y-0.5'
    : ''

  return (
    <div
      className={cn(base, variants[variant], hoverStyle, 'p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function LightCard({ children, className, hoverable = true, ...props }) {
  return (
    <Card variant="light" hoverable={hoverable} className={className} {...props}>
      {children}
    </Card>
  )
}

export function DarkCard({ children, className, hoverable = true, ...props }) {
  return (
    <Card variant="dark" hoverable={hoverable} className={className} {...props}>
      {children}
    </Card>
  )
}

export function StatCard({
  label,
  value,
  secondaryText,
  icon: Icon,
  variant = 'light',
  trend,
  className,
  ...props
}) {
  const isDark = variant === 'dark'

  return (
    <Card
      variant={variant}
      className={cn('p-5 flex flex-col justify-between', className)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'text-xs font-medium tracking-tight uppercase',
            isDark ? 'text-[#8E8E8E]' : 'text-[#6B6B6B]'
          )}
        >
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
              isDark ? 'bg-white/10 text-white' : 'bg-[#F4F4F1] text-[#111111]'
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              'text-2xl sm:text-3xl font-semibold tracking-tight',
              isDark ? 'text-white' : 'text-[#111111]'
            )}
          >
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'text-xs font-medium',
                trend.positive ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {trend.positive ? '↑' : '↓'} {trend.text}
            </span>
          )}
        </div>
        {secondaryText && (
          <p
            className={cn(
              'text-xs mt-1',
              isDark ? 'text-[#9A9A9A]' : 'text-[#6B6B6B]'
            )}
          >
            {secondaryText}
          </p>
        )}
      </div>
    </Card>
  )
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  badgeText,
  actionText,
  onAction,
  variant = 'light',
  className,
  ...props
}) {
  const isDark = variant === 'dark'

  return (
    <Card
      variant={variant}
      hoverable
      className={cn('flex flex-col justify-between p-6', className)}
      {...props}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          {Icon && (
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                isDark
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'bg-[#F4F4F1] text-[#111111] border border-[#E8E8E5]'
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          {badgeText && (
            <span
              className={cn(
                'text-[11px] font-medium px-2 py-0.5 rounded-full',
                isDark
                  ? 'bg-white/10 text-white/90'
                  : 'bg-[#F4F4F1] text-[#6B6B6B]'
              )}
            >
              {badgeText}
            </span>
          )}
        </div>

        <h3
          className={cn(
            'text-base font-semibold tracking-tight',
            isDark ? 'text-white' : 'text-[#111111]'
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-xs sm:text-sm mt-1.5 leading-relaxed',
            isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'
          )}
        >
          {description}
        </p>
      </div>

      {actionText && (
        <div className="mt-5 pt-4 border-t border-current/10">
          <button
            onClick={onAction}
            className={cn(
              'text-xs font-semibold inline-flex items-center gap-1.5 transition-colors',
              isDark
                ? 'text-[#D95B14] hover:text-[#FFA066]'
                : 'text-[#D95B14] hover:text-[#BF4D0C]'
            )}
          >
            <span>{actionText}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </Card>
  )
}

export default Card
