"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Film, MessageSquare } from "lucide-react"
import FriendPicker from "@/components/FriendPicker"
import { MovieSearchModal } from "@/components/MovieSearchModal"
import { getCurrentUser } from "@/lib/mockUser"

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  overview?: string
}

interface Friend {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

interface CreateCineLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingCinegroupId?: string // If provided, add movies to existing group instead of creating new
}

export function CreateCineLinkModal({ open, onOpenChange, existingCinegroupId }: CreateCineLinkModalProps) {
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([])
  const [boardName, setBoardName] = useState("")
  const [message, setMessage] = useState("")
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([])
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const resetForm = () => {
    setSelectedFriends([])
    setBoardName("")
    setMessage("")
    setSelectedMovies([])
    setError("")
    setIsSubmitting(false)
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm()
    }
    onOpenChange(open)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Basic validation
      if (selectedMovies.length === 0) {
        setError("Please add at least one movie")
        return
      }

      // If adding to existing group, skip friend/name validation
      if (!existingCinegroupId) {
        if (selectedFriends.length === 0) {
          setError("Please select at least one friend")
          return
        }

        if (!boardName) {
          setError("Please enter a board name")
          return
        }
      }

      const user = getCurrentUser()
      let groupId = existingCinegroupId

      // If not adding to existing group, create a new one
      if (!groupId) {
        // Create cinegroup for each friend (or one group with all friends)
        // For simplicity, creating one group with all selected friends
        const memberIds = [user.id, ...selectedFriends.map((f) => f.id)]

        const groupResponse = await fetch('/api/cinegroups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: boardName,
            ownerId: user.id,
            memberIds: memberIds,
          }),
        })

        if (!groupResponse.ok) {
          throw new Error('Failed to create cinegroup')
        }

        const group = await groupResponse.json()
        groupId = group.id
      }

      // Create cineboards for each selected movie
      for (const movie of selectedMovies) {
        const boardResponse = await fetch(`/api/cinegroups/${groupId}/cineboards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movieId: movie.id,
            movieSnapshot: movie,
            senderId: user.id,
            personalMessage: message,
          }),
        })

        if (!boardResponse.ok) {
          console.error('Failed to create cineboard for movie:', movie.title)
        }
      }

      handleClose(false)
    } catch (err) {
      console.error('Error creating CineLink:', err)
      setError("Failed to create CineLink. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFriendSelect = (friend: Friend) => {
    if (!selectedFriends.some((f) => f.id === friend.id)) {
      setSelectedFriends([...selectedFriends, friend])
    }
  }

  const handleFriendRemove = (friendId: string) => {
    setSelectedFriends(selectedFriends.filter((f) => f.id !== friendId))
  }

  const handleMovieSelect = (movie: Movie) => {
    if (!selectedMovies.some((m) => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie])
    }
  }

  const handleMovieRemove = (movieId: number) => {
    setSelectedMovies(selectedMovies.filter((m) => m.id !== movieId))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {existingCinegroupId ? 'Add Movies to Group' : 'Create a CineLink'}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <form id="cinelink-form" onSubmit={handleSubmit} className="space-y-3 pt-3 pb-3">
          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Select Friends - Only show if not adding to existing group */}
          {!existingCinegroupId && (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Select Friends
                </Label>
                <FriendPicker
                  onSelect={handleFriendSelect}
                  selectedFriends={selectedFriends}
                  onRemove={handleFriendRemove}
                  multiple={true}
                />
                <p className="text-xs text-muted-foreground">Select friends to share this CineBoard with</p>
              </div>

              {/* Board Name */}
              <div className="space-y-2">
                <Label htmlFor="boardName" className="text-sm font-medium text-foreground">
                  Board Name
                </Label>
                <Input
                  id="boardName"
                  placeholder="Movie picks for Sarah"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Give your CineBoard a descriptive name</p>
              </div>
            </>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-foreground">
              Personal Message (Optional)
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="message"
                placeholder="Here are some films I think you'd enjoy..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
                className="pl-10 min-h-[60px] resize-none"
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Add a personal note to your friend</p>
              <span className="text-xs text-muted-foreground">{message.length}/200</span>
            </div>
          </div>

          {/* Add Films */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Add Films</Label>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {selectedMovies.length} selected
              </span>
            </div>

            {selectedMovies.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Film className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">No films selected yet</p>
                    <p className="text-xs text-muted-foreground">Add movies to create your CineBoard</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setIsMovieModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Films
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">
                    {selectedMovies.length} movie{selectedMovies.length !== 1 ? 's' : ''} selected
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMovieModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add More
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center justify-between p-2 bg-background rounded border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{movie.title}</p>
                        {movie.release_date && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(movie.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMovieRemove(movie.id)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={
                selectedMovies.length === 0 || 
                isSubmitting || 
                (!existingCinegroupId && (selectedFriends.length === 0 || !boardName))
              }
            >
              {isSubmitting 
                ? (existingCinegroupId ? "Adding..." : "Creating...") 
                : (existingCinegroupId ? "Add Movies" : "Create CineLink")}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>

      {/* Movie Search Modal */}
      <MovieSearchModal
        open={isMovieModalOpen}
        onOpenChange={setIsMovieModalOpen}
        selectedMovies={selectedMovies}
        onSelectMovie={handleMovieSelect}
        onRemoveMovie={handleMovieRemove}
      />
    </Dialog>
  )
}
