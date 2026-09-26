import React from 'react'
import { cn } from '../../utils/cn'

export function Skeleton({ className, rounded = 'md', ...props }) {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-[8px]',
    lg: 'rounded-[12px]',
    full: 'rounded-full',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-[#EFEFED] border border-[#E8E8E5]/50',
        roundedClasses[rounded],
        className
      )}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="p-6 rounded-[14px] bg-white border border-[#E8E8E5] space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-44" />
    </div>
  )
}

export default Skeleton
