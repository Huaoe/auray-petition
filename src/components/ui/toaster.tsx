'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToasterProps {
  toasts?: Toast[]
}

const toastVariants = {
  default: {
    className: 'bg-white border-gray-200 text-gray-900',
    icon: null,
  },
  success: {
    className: 'bg-green-50 border-green-200 text-green-900',
    icon: CheckCircle,
  },
  error: {
    className: 'bg-red-50 border-red-200 text-red-900',
    icon: XCircle,
  },
  warning: {
    className: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    icon: AlertCircle,
  },
  info: {
    className: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: Info,
  },
}

// Toast store (simple state management)
class ToastStore {
  private toasts: Toast[] = []
  private listeners: ((toasts: Toast[]) => void)[] = []

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  getToasts() {
    return this.toasts
  }

  addToast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substring(2)
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    }
    
    this.toasts = [...this.toasts, newToast]
    this.notifyListeners()

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.removeToast(id)
      }, newToast.duration)
    }
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.toasts))
  }
}

const toastStore = new ToastStore()

// Hook to use toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts)
    setToasts(toastStore.getToasts())
    return unsubscribe
  }, [])

  const toast = (props: Omit<Toast, 'id'>) => {
    toastStore.addToast(props)
  }

  const dismiss = (id: string) => {
    toastStore.removeToast(id)
  }

  return {
    toasts,
    toast,
    dismiss,
  }
}

// Toast component
const ToastComponent = ({ 
  toast, 
  onDismiss 
}: { 
  toast: Toast
  onDismiss: (id: string) => void 
}) => {
  const variant = toastVariants[toast.variant || 'default']
  const IconComponent = variant.icon

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-md rounded-lg border p-4 shadow-lg transition-all',
        'animate-slide-in-right',
        variant.className
      )}
    >
      <div className="flex">
        {IconComponent && (
          <div className="flex-shrink-0">
            <IconComponent className="h-5 w-5" />
          </div>
        )}
        <div className={cn('ml-3 w-0 flex-1', !IconComponent && 'ml-0')}>
          {toast.title && (
            <p className="text-sm font-medium">
              {toast.title}
            </p>
          )}
          {toast.description && (
            <p className={cn(
              'text-sm opacity-90',
              toast.title && 'mt-1'
            )}>
              {toast.description}
            </p>
          )}
        </div>
      </div>
      <div className="ml-4 flex flex-shrink-0">
        <button
          type="button"
          className="inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          onClick={() => onDismiss(toast.id)}
        >
          <span className="sr-only">Fermer</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Main Toaster component
export const Toaster = ({ toasts: propToasts }: ToasterProps) => {
  const { toasts: hookToasts, dismiss } = useToast()
  const toasts = propToasts || hookToasts

  if (!toasts.length) return null

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onDismiss={dismiss}
        />
      ))}
    </div>
  )
}

// Helper functions
export const toast = {
  success: (title: string, description?: string) => {
    toastStore.addToast({
      title,
      description,
      variant: 'success',
    })
  },
  error: (title: string, description?: string) => {
    toastStore.addToast({
      title,
      description,
      variant: 'error',
    })
  },
  warning: (title: string, description?: string) => {
    toastStore.addToast({
      title,
      description,
      variant: 'warning',
    })
  },
  info: (title: string, description?: string) => {
    toastStore.addToast({
      title,
      description,
      variant: 'info',
    })
  },
  default: (title: string, description?: string) => {
    toastStore.addToast({
      title,
      description,
      variant: 'default',
    })
  },
}
