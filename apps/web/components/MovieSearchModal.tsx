'use client'

/**
 * MovieSearchModal Component
 * 
 * A modal for searching and selecting movies from TMDB.
 * Used in the create-cinelink-modal when clicking "Add Films" button.
 */

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Search, Calendar } from 'lucide-react'
import Image from 'next/image'
import { getTMDBImageUrl } from '@/lib/tmdb'

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  overview?: string
}

interface MovieSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedMovies: Movie[]
  onSelectMovie: (movie: Movie) => void
  onRemoveMovie: (movieId: number) => void
}

export function MovieSearchModal({
  open,
  onOpenChange,
  selectedMovies,
  onSelectMovie,
  onRemoveMovie,
}: MovieSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)

  async function handleSearch() {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const res = await fetch('/api/tmdb/search?q=' + encodeURIComponent(searchQuery))
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Error searching movies:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  function handleMovieClick(movie: Movie) {
    // Check if already selected
    if (selectedMovies.some((m) => m.id === movie.id)) {
      onRemoveMovie(movie.id)
    } else {
      onSelectMovie(movie)
    }
  }

  function isSelected(movieId: number) {
    return selectedMovies.some((m) => m.id === movieId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle>Search and Select Movies</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for movies..."
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Selected Movies */}
          {selectedMovies.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Selected Movies ({selectedMovies.length})</div>
              <div className="flex flex-wrap gap-2">
                {selectedMovies.map((movie) => (
                  <Badge
                    key={movie.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {movie.title}
                    <button
                      onClick={() => onRemoveMovie(movie.id)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Results</div>
            {results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No results found' : 'Search for movies to see results'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {results.map((movie) => {
                  const selected = isSelected(movie.id)
                  return (
                    <div
                      key={movie.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => handleMovieClick(movie)}
                    >
                      <div className="flex gap-3">
                        <div className="relative w-16 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                          {movie.poster_path ? (
                            <Image
                              src={getTMDBImageUrl(movie.poster_path, 'w200') || '/placeholder.jpg'}
                              alt={movie.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder.jpg'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No poster
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm line-clamp-2">{movie.title}</h4>
                            {selected && (
                              <Badge variant="default" className="flex-shrink-0">
                                Selected
                              </Badge>
                            )}
                          </div>
                          {movie.release_date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(movie.release_date).getFullYear()}
                            </div>
                          )}
                          {movie.overview && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {movie.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

