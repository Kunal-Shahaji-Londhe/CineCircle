/**
 * MovieSimilar Component
 * 
 * Displays similar/recommended movies in a horizontal scrollable list.
 * 
 * This component is modular and can be easily extended or replaced.
 */

'use client'

import React from 'react'
import { Movie } from '@/lib/tmdb'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { getTMDBImageUrl } from '@/lib/tmdb'

interface MovieSimilarProps {
  movies: Movie[]
  maxMovies?: number
}

export function MovieSimilar({ movies, maxMovies = 10 }: MovieSimilarProps) {
  if (!movies || movies.length === 0) {
    return null
  }

  const displayMovies = movies.slice(0, maxMovies)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Similar Movies</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {displayMovies.map((movie) => {
          const posterUrl = getTMDBImageUrl(movie.poster_path, 'w300')

          return (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="flex-shrink-0 w-40 sm:w-48"
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <div className="relative aspect-[2/3] bg-muted rounded-t-lg overflow-hidden">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No poster
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">
                    {movie.title}
                  </h3>
                  {movie.release_date && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

