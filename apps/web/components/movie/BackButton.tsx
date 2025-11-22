/**
 * BackButton Component
 * 
 * Smart back button that navigates to the previous page or dashboard.
 * Uses browser history when available, falls back to dashboard.
 * 
 * This component is modular and can be easily updated.
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      // Fallback to dashboard
      router.push('/dashboard')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="hover:bg-muted"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  )
}

