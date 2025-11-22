/**
 * Loading State for Movie Detail Page
 * 
 * Displays skeleton loaders while the movie data is being fetched.
 * Follows the same layout structure as the actual page for smooth transition.
 */

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Back Button Skeleton */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative w-full pt-6">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster Skeleton */}
            <div className="flex-shrink-0 w-full md:w-64 lg:w-80">
              <Skeleton className="aspect-[2/3] rounded-lg" />
            </div>

            {/* Info Skeleton */}
            <div className="flex-1 space-y-4 pb-6">
              <div className="space-y-2">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Actions Skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Cast Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metadata Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

