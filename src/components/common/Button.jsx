import React from 'react'
import { cn } from '../../utils/cn'
import { Loader2 } from 'lucide-react'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-[10px] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100'

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-sm px-5 py-2.5 gap-2.5 h-11',
    icon: 'h-10 w-10 p-0',
  }

  const variantStyles = {
    primary: 'bg-[#111111] text-white hover:bg-[#222222] shadow-subtle',
    secondary: 'bg-white text-[#111111] border border-[#E8E8E5] hover:bg-[#F4F4F1] hover:border-[#DCDCD8] shadow-subtle',
    ghost: 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F4F4F1]',
    accent: 'bg-[#D95B14] text-white hover:bg-[#BF4D0C] shadow-subtle',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    dark: 'bg-[#1A1A1A] text-white border border-[#2A2A28] hover:bg-[#252525]',
  }

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  )
}

export function PrimaryButton(props) {
  return <Button variant="primary" {...props} />
}

export function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />
}

export function GhostButton(props) {
  return <Button variant="ghost" {...props} />
}

export function AccentButton(props) {
  return <Button variant="accent" {...props} />
}

export default Button
