/**
 * MovieHero Component
 * 
 * Displays the hero section of a movie detail page with backdrop image,
 * title, tagline, and key metadata.
 * 
 * This component is modular and can be easily updated or extended.
 */

'use client'

import React from 'react'
import Image from 'next/image'
import { getTMDBImageUrl, Movie } from '@/lib/tmdb'
import { Badge } from '@/components/ui/badge'
import { Star, Calendar, Clock } from 'lucide-react'

interface MovieHeroProps {
  movie: Movie
}

export function MovieHero({ movie }: MovieHeroProps) {
  const backdropUrl = getTMDBImageUrl(movie.backdrop_path, 'original')
  const posterUrl = getTMDBImageUrl(movie.poster_path, 'w500')

  return (
    <div className="relative w-full">
      {/* Backdrop Image */}
      {backdropUrl && (
        <div className="absolute inset-0 h-[60vh] min-h-[400px] max-h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-20 ${backdropUrl ? 'pt-[40vh]' : 'pt-6'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="flex-shrink-0 w-full md:w-64 lg:w-80">
              <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden shadow-2xl">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No poster available
                  </div>
                )}
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-4 pb-6">
              {/* Title and Tagline */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">{movie.title}</h1>
                {movie.tagline && (
                  <p className="text-lg text-muted-foreground italic">"{movie.tagline}"</p>
                )}
              </div>

              {/* Rating and Votes */}
              {movie.vote_average && (
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-primary text-primary" />
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

              {/* Metadata Row */}
              <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                {movie.release_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
                {movie.original_language && (
                  <div className="uppercase">
                    {movie.original_language}
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

