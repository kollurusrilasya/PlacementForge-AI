import React, { createContext, useContext, useState, useCallback } from 'react'
import ToastContainer from '../components/common/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((message, options = {}) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6)
    const toast = {
      id,
      message,
      type: options.type || 'info', // 'info' | 'success' | 'error' | 'forge'
      duration: options.duration || 3500,
    }

    setToasts((prev) => [...prev, toast])

    if (toast.duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, toast.duration)
    }

    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastContext
