import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Format number with French locale
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

/**
 * Format date to French format
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/**
 * Format date and time to French format
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Calculate signature progress percentage
 */
export const calculateProgress = (current: number, target: number): number => {
  return Math.min(Math.round((current / target) * 100), 100)
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate French postal code
 */
export const isValidPostalCode = (code: string): boolean => {
  const postalRegex = /^[0-9]{5}$/
  return postalRegex.test(code)
}

/**
 * Validate French phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/
  const cleanPhone = phone.replace(/[\s.-]/g, '')
  return phoneRegex.test(cleanPhone)
}

/**
 * Email validation function
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * French postal code validation function
 */
export const validatePostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^[0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Sleep utility for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Share data using Web Share API with fallback
 */
export const shareContent = async (data: {
  title: string
  text: string
  url: string
}): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share(data)
      return true
    } else {
      // Fallback to clipboard
      const shareText = `${data.title}\n${data.text}\n${data.url}`
      return await copyToClipboard(shareText)
    }
  } catch (error) {
    console.error('Failed to share:', error)
    return false
  }
}

/**
 * Get time remaining until target date
 */
export const getTimeRemaining = (targetDate: Date) => {
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()
  
  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true
    }
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)
  
  return {
    days,
    hours,
    minutes,
    seconds,
    expired: false
  }
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Convert string to URL-friendly slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Get environment variable with type safety
 */
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key]
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`)
  }
  return value || defaultValue || ''
}

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development'
}

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production'
}

/**
 * Analytics event tracking helper
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

/**
 * Constants for the application
 */
export const CONSTANTS = {
  PETITION_TARGET: 500,
  CHURCH_NAME: 'Église Saint-Gildas d\'Auray',
  CITY_NAME: 'Auray',
  RESIDENTS_NAME: 'Alréens',
  PROJECT_EMAIL: 'auray.petition@gmail.com',
  SOCIAL_HASHTAGS: ['#AurayTransformée', '#AlréensEnsemble', '#ÉquilibreCloches']
} as const
