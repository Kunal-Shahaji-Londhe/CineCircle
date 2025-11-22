/**
 * MovieActions Component
 * 
 * Displays action buttons for a movie (Share to CineGroup, Add to Watchlist, etc.)
 * 
 * This component is modular and can be easily extended with more actions.
 */

'use client'

import React, { useState } from 'react'
import { Movie } from '@/lib/tmdb'
import { Button } from '@/components/ui/button'
import { Share2, Bookmark, BookmarkCheck } from 'lucide-react'
import { CreateCineLinkModal } from '@/components/create-cinelink-modal'

interface MovieActionsProps {
  movie: Movie
}

export function MovieActions({ movie }: MovieActionsProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  // TODO: Replace with real watchlist API call
  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist)
    // TODO: Call API to add/remove from watchlist
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => setIsShareModalOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share to CineGroup
      </Button>

      <Button
        variant="outline"
        onClick={handleWatchlistToggle}
      >
        {isInWatchlist ? (
          <>
            <BookmarkCheck className="w-4 h-4 mr-2" />
            In Watchlist
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4 mr-2" />
            Add to Watchlist
          </>
        )}
      </Button>

      {/* Share Modal - Pre-fills the movie */}
      <CreateCineLinkModal
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        preselectedMovie={movie}
      />
    </div>
  )
}

