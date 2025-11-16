/**
 * CineGroup Detail Page
 * 
 * Displays a specific cinegroup with its cineboards (movie recommendations).
 * Shows a Kanban-like view of movies shared in the group.
 * 
 * TODO: Integrate with real auth to check group membership.
 */

'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CreateCineLinkModal } from '@/components/create-cinelink-modal'
import { getCurrentUser } from '@/lib/mockUser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ArrowLeft, Check, Eye, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getTMDBImageUrl } from '@/lib/tmdb'

interface CineGroup {
  id: string
  name: string
  ownerId: string
  memberIds: string[]
  createdAt: string
}

interface CineBoard {
  id: string
  cinegroupId: string
  movieId: number
  movieSnapshot: {
    id: number
    title: string
    poster_path: string | null
    release_date: string
    overview?: string
  }
  senderId: string
  personalMessage?: string
  meta: {
    seenBy: string[]
    watchedBy: string[]
  }
  createdAt: string
}

export default function CineGroupDetail() {
  const params = useParams()
  const router = useRouter()
  const { id } = params as { id: string }

  const [group, setGroup] = useState<CineGroup | null>(null)
  const [boards, setBoards] = useState<CineBoard[]>([])
  const [showShare, setShowShare] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchGroup()
      fetchBoards()
    }
  }, [id])

  async function fetchGroup() {
    try {
      const response = await fetch('/api/cinegroups')
      if (response.ok) {
        const groups = await response.json()
        const found = groups.find((g: CineGroup) => g.id === id)
        setGroup(found || null)
      }
    } catch (error) {
      console.error('Error fetching group:', error)
    }
  }

  async function fetchBoards() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cinegroups/${id}/cineboards`)
      if (response.ok) {
        const data = await response.json()
        setBoards(data)
      }
    } catch (error) {
      console.error('Error fetching boards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function markWatched(boardId: string) {
    const user = getCurrentUser()

    try {
      const response = await fetch(`/api/cineboards/${boardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_watched', userId: user.id }),
      })

      if (response.ok) {
        // Optimistically update the UI
        setBoards((b) =>
          b.map((x) =>
            x.id === boardId
              ? {
                  ...x,
                  meta: {
                    ...x.meta,
                    watchedBy: [...(x.meta.watchedBy || []), user.id],
                  },
                }
              : x
          )
        )
      }
    } catch (error) {
      console.error('Error marking as watched:', error)
    }
  }

  async function markSeen(boardId: string) {
    const user = getCurrentUser()

    try {
      const response = await fetch(`/api/cineboards/${boardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_watching', userId: user.id }),
      })

      if (response.ok) {
        setBoards((b) =>
          b.map((x) =>
            x.id === boardId
              ? {
                  ...x,
                  meta: {
                    ...x.meta,
                    seenBy: [...(x.meta.seenBy || []), user.id],
                  },
                }
              : x
          )
        )
      }
    } catch (error) {
      console.error('Error marking as seen:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading group...</div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Group not found</h3>
            <Button onClick={() => router.push('/cinegroups')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to CineGroups
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = getCurrentUser()
  const hasUserWatched = (board: CineBoard) =>
    board.meta?.watchedBy?.includes(user.id) || false
  const hasUserSeen = (board: CineBoard) =>
    board.meta?.seenBy?.includes(user.id) || false

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/cinegroups')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground mt-1">
            {group.memberIds.length} member{group.memberIds.length !== 1 ? 's' : ''} • Created{' '}
            {new Date(group.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => setShowShare(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Share to group
        </Button>
      </div>

      {boards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No movies shared yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share a movie in this group!
            </p>
            <Button onClick={() => setShowShare(true)}>
              Share a movie
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((b) => (
            <Card key={b.id} className="overflow-hidden">
              <div className="relative aspect-[2/3] bg-muted">
                  {b.movieSnapshot.poster_path ? (
                    <Image
                      src={getTMDBImageUrl(b.movieSnapshot.poster_path, 'w500') || '/placeholder.jpg'}
                      alt={b.movieSnapshot.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to placeholder
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.jpg'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No poster
                    </div>
                  )}
                {hasUserWatched(b) && (
                  <Badge
                    className="absolute top-2 right-2 bg-green-600"
                    variant="default"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Watched
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  {b.movieSnapshot.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {b.movieSnapshot.release_date
                    ? new Date(b.movieSnapshot.release_date).getFullYear()
                    : 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {b.personalMessage && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    &quot;{b.personalMessage}&quot;
                  </p>
                )}
                <div className="flex gap-2 flex-wrap">
                  {!hasUserSeen(b) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markSeen(b.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Start watching
                    </Button>
                  )}
                  {!hasUserWatched(b) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markWatched(b.id)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark watched
                    </Button>
                  )}
                  <Link href={`/movies/${b.movieSnapshot.id}`}>
                    <Button variant="outline" size="sm">
                      View details
                    </Button>
                  </Link>
                </div>
                <div className="text-xs text-muted-foreground">
                  Watched by {b.meta?.watchedBy?.length || 0} • Seen by{' '}
                  {b.meta?.seenBy?.length || 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateCineLinkModal 
        open={showShare} 
        onOpenChange={(open) => {
          setShowShare(open)
          if (!open) {
            fetchBoards()
          }
        }}
        existingCinegroupId={id}
      />
    </div>
  )
}

