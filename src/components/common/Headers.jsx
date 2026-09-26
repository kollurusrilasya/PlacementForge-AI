import React from 'react'
import { cn } from '../../utils/cn'

export function PageHeader({
  title,
  subtitle,
  badge,
  action,
  breadcrumbs,
  className,
}) {
  return (
    <div className={cn('pb-6 mb-8 border-b border-[#E8E8E5]', className)}>
      {breadcrumbs && (
        <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-3 font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-[#A0A0A0]">/</span>}
              <span className={idx === breadcrumbs.length - 1 ? 'text-[#111111]' : ''}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-sm text-[#6B6B6B] mt-1.5 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>
    </div>
  )
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4 mb-4', className)}>
      <div>
        <h2 className="text-base sm:text-lg font-medium text-[#111111] tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default PageHeader
