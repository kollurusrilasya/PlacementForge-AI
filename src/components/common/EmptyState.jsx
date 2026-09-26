import React from 'react'
import { cn } from '../../utils/cn'
import { Button } from './Button'

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[16px] border border-dashed border-[#DCDCD8] bg-[#FAFAF9]',
        className
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-white border border-[#E8E8E5] flex items-center justify-center text-[#111111] mb-4 shadow-subtle">
          <Icon className="w-5 h-5 opacity-80" />
        </div>
      )}

      <h3 className="text-base font-semibold text-[#111111] tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1.5 max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {actionText && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  )
}

export default EmptyState
