/**
 * Movie Detail Page (Stub)
 * 
 * Displays detailed information about a movie.
 * 
 * TODO: Enhance with full movie details, cast, reviews, etc.
 * TODO: Add watchlist functionality
 * TODO: Add rating functionality
 */

import React from 'react'
import { getMovieById } from '@/lib/tmdb'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTMDBImageUrl } from '@/lib/tmdb'

interface MoviePageProps {
  params: { id: string }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = params
  const movieId = Number(id)

  if (isNaN(movieId)) {
    notFound()
  }

  let movie
  try {
    movie = await getMovieById(movieId)
  } catch (error) {
    console.error('Error fetching movie:', error)
    notFound()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link href="/cinegroups">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to CineGroups
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <div className="relative aspect-[2/3] bg-muted rounded-t-lg overflow-hidden">
              {movie.poster_path ? (
                <Image
                  src={getTMDBImageUrl(movie.poster_path, 'w500') || '/placeholder.jpg'}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.jpg'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No poster available
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            {movie.release_date && (
              <p className="text-muted-foreground">
                Released: {new Date(movie.release_date).toLocaleDateString()}
              </p>
            )}
          </div>

          {movie.vote_average && (
            <div className="flex items-center gap-4">
              <div>
                <span className="text-2xl font-bold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-muted-foreground">/10</span>
              </div>
              {movie.vote_count && (
                <span className="text-sm text-muted-foreground">
                  {movie.vote_count.toLocaleString()} votes
                </span>
              )}
            </div>
          )}

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground">
                {movie.overview || 'No overview available.'}
              </p>
            </CardContent>
          </Card>

          {/* TODO: Add more sections like cast, reviews, recommendations */}
        </div>
      </div>
    </div>
  )
}

