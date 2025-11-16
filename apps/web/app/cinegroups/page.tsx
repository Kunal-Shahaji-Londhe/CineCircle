/**
 * CineGroups List Page
 * 
 * Displays all cinegroups that the user is a member of.
 * Allows creating new groups and sharing movies.
 * 
 * TODO: Filter groups by current user once real auth is integrated.
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/mockUser'
import { CreateCineLinkModal } from '@/components/create-cinelink-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Users } from 'lucide-react'

interface CineGroup {
  id: string
  name: string
  ownerId: string
  memberIds: string[]
  createdAt: string
}

export default function CineGroupsPage() {
  const [groups, setGroups] = useState<CineGroup[]>([])
  const [showShare, setShowShare] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGroups()
  }, [])

  async function fetchGroups() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/cinegroups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const user = getCurrentUser()

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading cinegroups...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Your CineGroups</h1>
          <p className="text-muted-foreground mt-1">
            Share movies and create watchlists with friends
          </p>
        </div>
        <Button onClick={() => setShowShare(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Share a movie
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No cinegroups yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by sharing a movie with a friend!
            </p>
            <Button onClick={() => setShowShare(true)}>
              Share your first movie
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <Link key={g.id} href={`/cinegroups/${g.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{g.name}</CardTitle>
                  <CardDescription>
                    Created {new Date(g.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{g.memberIds.length} member{g.memberIds.length !== 1 ? 's' : ''}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateCineLinkModal 
        open={showShare} 
        onOpenChange={(open) => {
          setShowShare(open)
          if (!open) {
            fetchGroups()
          }
        }} 
      />
    </div>
  )
}

