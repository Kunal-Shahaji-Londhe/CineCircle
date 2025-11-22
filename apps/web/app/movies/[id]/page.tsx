/**
 * Movie Detail Page
 * 
 * Displays comprehensive information about a movie including:
 * - Hero section with backdrop and poster
 * - Movie metadata (genres, runtime, etc.)
 * - Cast members
 * - Similar movies
 * - Action buttons (Share, Watchlist)
 * 
 * This page is modular and can be easily extended with additional sections.
 * 
 * Architecture:
 * - Server component for data fetching
 * - Modular components in components/movie/ directory
 * - Follows existing design patterns (Card, Badge, etc.)
 */

import React from 'react'
import { getMovieById } from '@/lib/tmdb'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { MovieHero } from '@/components/movie/MovieHero'
import { MovieMetadata } from '@/components/movie/MovieMetadata'
import { MovieCast } from '@/components/movie/MovieCast'
import { MovieActions } from '@/components/movie/MovieActions'
import { MovieSimilar } from '@/components/movie/MovieSimilar'
import { BackButton } from '@/components/movie/BackButton'

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
    // Fetch movie with credits and similar movies
    movie = await getMovieById(movieId, true)
  } catch (error) {
    console.error('Error fetching movie:', error)
    notFound()
  }

  const similarMovies = movie.similar?.results || []

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button - Fixed at top */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <BackButton />
        </div>
      </div>

      {/* Hero Section */}
      <MovieHero movie={movie} />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Action Buttons */}
        <MovieActions movie={movie} />

        {/* Cast Section */}
        <MovieCast movie={movie} />

        {/* Additional Metadata */}
        <MovieMetadata movie={movie} />

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <MovieSimilar movies={similarMovies} />
        )}
      </div>
    </div>
  )
}

