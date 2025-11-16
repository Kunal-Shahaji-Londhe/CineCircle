"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell, Plus } from "lucide-react"
import { getTMDBImageUrl } from "@/lib/tmdb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateCineLinkModal } from "@/components/create-cinelink-modal"
import { NotificationsPanel } from "@/components/notifications-panel"
import { useAuth } from "@/components/auth-provider"
import { Sidebar, MobileMenuButton } from "@/components/sidebar"

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
    title: string
    poster_path?: string | null
  }
  meta: {
    watchedBy: string[]
    seenBy: string[]
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [cinegroups, setCinegroups] = useState<CineGroup[]>([])
  const [cineboards, setCineboards] = useState<Record<string, CineBoard[]>>({})
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchCinegroups()
    }
  }, [isAuthenticated])

  // Debounced movie search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch('/api/tmdb/search?q=' + encodeURIComponent(searchQuery))
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data)
          setShowSearchResults(true)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error('Error searching movies:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  async function fetchCinegroups() {
    try {
      setIsLoadingGroups(true)
      const response = await fetch('/api/cinegroups')
      if (response.ok) {
        const groups = await response.json()
        setCinegroups(groups)

        // Fetch boards for each group
        const boardsMap: Record<string, CineBoard[]> = {}
        for (const group of groups) {
          try {
            const boardsResponse = await fetch(`/api/cinegroups/${group.id}/cineboards`)
            if (boardsResponse.ok) {
              boardsMap[group.id] = await boardsResponse.json()
            }
          } catch (error) {
            console.error(`Error fetching boards for group ${group.id}:`, error)
            boardsMap[group.id] = []
          }
        }
        setCineboards(boardsMap)
      }
    } catch (error) {
      console.error('Error fetching cinegroups:', error)
    } finally {
      setIsLoadingGroups(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar currentPage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MobileMenuButton onClick={() => {}} />
              <h1 className="text-lg lg:text-2xl font-bold text-foreground truncate">
                Hi {user.name.split(' ')[0]}, here are your CineLinks
              </h1>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Search films..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchResults(true)
                  }}
                  onBlur={() => {
                    // Delay to allow clicking on results
                    setTimeout(() => setShowSearchResults(false), 200)
                  }}
                  className="pl-10 w-48 lg:w-64 bg-background border-border"
                />
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="p-2 space-y-1">
                      {searchResults.slice(0, 5).map((movie) => (
                        <a
                          key={movie.id}
                          href={`/movies/${movie.id}`}
                          className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {movie.poster_path && (
                            <img
                              src={getTMDBImageUrl(movie.poster_path, 'w92') || '/placeholder.jpg'}
                              alt={movie.title}
                              className="w-12 h-16 object-cover rounded flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder.jpg'
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{movie.title}</div>
                            {movie.release_date && (
                              <div className="text-xs text-muted-foreground">
                                {new Date(movie.release_date).getFullYear()}
                              </div>
                            )}
                          </div>
                        </a>
                      ))}
                      {searchResults.length > 5 && (
                        <div className="text-xs text-muted-foreground text-center p-2">
                          {searchResults.length - 5} more results...
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {isSearching && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden text-muted-foreground hover:text-foreground"
                onClick={() => {
                  // You can implement a mobile search modal here
                  console.log('Mobile search clicked')
                }}
              >
                <Search className="w-5 h-5" />
              </Button>
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground relative"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </div>
                </Button>
                <NotificationsPanel open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="space-y-4 lg:space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New CineLink
              </Button>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                <Select defaultValue="recently-updated">
                  <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recently-updated">Recently updated</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="most-films">Most films</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CineGroups List */}
            {isLoadingGroups ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading cinegroups...</p>
              </div>
            ) : cinegroups.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No cinegroups yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first CineLink to get started!
                </p>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create CineLink
                </Button>
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-4">
                {cinegroups.map((group) => {
                  const boards = cineboards[group.id] || []
                  const watchedCount = boards.reduce(
                    (count, board) => count + (board.meta?.watchedBy?.length || 0),
                    0
                  )
                  const borderColors = [
                    "border-l-primary",
                    "border-l-purple-500",
                    "border-l-orange-500",
                    "border-l-blue-500",
                    "border-l-green-500",
                  ]
                  const borderColor = borderColors[parseInt(group.id.slice(-1)) % borderColors.length] || "border-l-primary"

                  return (
                    <a
                      key={group.id}
                      href={`/cinelink/${group.id}`}
                      className={`block bg-card border border-border rounded-lg p-4 lg:p-6 hover:bg-muted/50 transition-colors border-l-4 ${borderColor}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base lg:text-lg font-semibold text-foreground mb-1 lg:mb-2 truncate">
                            {group.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>
                              {boards.length} film{boards.length !== 1 ? 's' : ''} • {watchedCount} watched
                            </span>
                            <span>{group.memberIds.length} member{group.memberIds.length !== 1 ? 's' : ''}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 lg:mt-2">
                            Created {new Date(group.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
                          <AvatarImage src="/diverse-user-avatars.png" />
                          <AvatarFallback>CG</AvatarFallback>
                        </Avatar>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create CineLink Modal */}
      <CreateCineLinkModal 
        open={isCreateModalOpen} 
        onOpenChange={(open) => {
          setIsCreateModalOpen(open)
          if (!open) {
            // Refresh groups when modal closes
            fetchCinegroups()
          }
        }} 
      />
    </div>
  )
}
