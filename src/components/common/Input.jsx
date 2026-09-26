import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(function Input(
  {
    label,
    description,
    error,
    icon: Icon,
    className,
    id,
    disabled = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[#111111]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6B6B]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3 text-sm bg-white text-[#111111] placeholder:text-[#9B9B98]',
            'rounded-[10px] border border-[#E8E8E5] transition-all duration-150',
            'focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]',
            'disabled:bg-[#F4F4F1] disabled:text-[#8E8E8E] disabled:cursor-not-allowed',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            Icon && 'pl-9',
            className
          )}
          {...props}
        />
      </div>

      {description && !error && (
        <p className="text-[11px] text-[#6B6B6B]">{description}</p>
      )}

      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  )
})

export const Select = forwardRef(function Select(
  {
    label,
    description,
    error,
    options = [],
    placeholder = 'Select an option',
    className,
    id,
    disabled = false,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-[#111111]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3 pr-8 text-sm bg-white text-[#111111] appearance-none',
            'rounded-[10px] border border-[#E8E8E5] transition-all duration-150',
            'focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]',
            'disabled:bg-[#F4F4F1] disabled:text-[#8E8E8E] disabled:cursor-not-allowed',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value
            const lbl = typeof opt === 'string' ? opt : opt.label
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            )
          })}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#6B6B6B]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {description && !error && (
        <p className="text-[11px] text-[#6B6B6B]">{description}</p>
      )}

      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  )
})

export default Input
