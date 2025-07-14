'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export const Analytics = () => {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  useEffect(() => {
    if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
      // Initialize Google Analytics
      window.gtag = window.gtag || function() {
        (window.gtag as any).q = (window.gtag as any).q || []
        ;(window.gtag as any).q.push(arguments)
      }
      
      window.gtag('js', new Date())
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [GA_MEASUREMENT_ID])

  if (!GA_MEASUREMENT_ID) {
    // Only show Vercel Analytics in production if no GA configured
    return process.env.NODE_ENV === 'production' ? <VercelAnalytics /> : null
  }

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
      
      {/* Vercel Analytics */}
      <VercelAnalytics />
    </>
  )
}
