import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'

export function ToastItem({ toast, onDismiss }) {
  const icons = {
    info: <Info className="w-4 h-4 text-[#111111] shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
    forge: (
      <span className="w-2 h-2 rounded-full bg-[#D95B14] shrink-0 inline-block" />
    ),
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[12px] bg-white border border-[#E8E8E5] shadow-dropdown text-xs sm:text-sm text-[#111111] pointer-events-auto transition-all duration-200 animate-in fade-in slide-in-from-bottom-2'
      )}
    >
      {icons[toast.type || 'info']}
      <span className="font-medium pr-2">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#6B6B6B] hover:text-[#111111] p-0.5 rounded transition-colors ml-auto"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export default ToastContainer
