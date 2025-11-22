/**
 * MovieCast Component
 * 
 * Displays the cast members of a movie.
 * Shows top cast members with their photos and character names.
 * 
 * This component is modular and can be easily extended to show more cast or crew.
 */

'use client'

import React from 'react'
import { Movie } from '@/lib/tmdb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getTMDBImageUrl } from '@/lib/tmdb'

interface MovieCastProps {
  movie: Movie
  maxCast?: number // Maximum number of cast members to show
}

export function MovieCast({ movie, maxCast = 10 }: MovieCastProps) {
  const cast = movie.credits?.cast || []

  if (cast.length === 0) {
    return null
  }

  const topCast = cast
    .sort((a, b) => a.order - b.order)
    .slice(0, maxCast)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topCast.map((actor) => {
            const profileUrl = getTMDBImageUrl(actor.profile_path, 'w185')
            const initials = actor.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)

            return (
              <div key={actor.id} className="flex flex-col items-center text-center space-y-2">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={profileUrl || undefined}
                    alt={actor.name}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-tight">{actor.name}</p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {actor.character}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

