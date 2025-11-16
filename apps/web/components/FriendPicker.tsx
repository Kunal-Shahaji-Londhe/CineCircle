'use client'

/**
 * FriendPicker Component
 * 
 * A component for searching and selecting friends from the mock friends list.
 * 
 * TODO: Replace the mock friends API call with the real friends endpoint
 * once the friend system is implemented in apps/api.
 */

import React, { useEffect, useState } from 'react'

type Friend = { 
  id: string
  name: string
  email: string
  avatarUrl?: string 
}

interface FriendPickerProps {
  onSelect: (friend: Friend) => void
  selectedFriends?: Friend[]
  onRemove?: (friendId: string) => void
  multiple?: boolean
}

export default function FriendPicker({ 
  onSelect, 
  selectedFriends = [],
  onRemove,
  multiple = false 
}: FriendPickerProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [q, setQ] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mock/friends')
      .then((r) => r.json())
      .then((data) => {
        setFriends(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching friends:', error)
        setFriends([])
        setIsLoading(false)
      })
  }, [])

  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(q.toLowerCase()) ||
    f.email.toLowerCase().includes(q.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="p-2 border rounded">
        <div className="text-sm text-slate-500">Loading friends...</div>
      </div>
    )
  }

  const isSelected = (friendId: string) => {
    return selectedFriends.some((f) => f.id === friendId)
  }

  const handleFriendClick = (friend: Friend) => {
    if (multiple && isSelected(friend.id) && onRemove) {
      onRemove(friend.id)
    } else if (!isSelected(friend.id)) {
      onSelect(friend)
    }
  }

  return (
    <div className="space-y-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search friends"
        className="w-full p-2 border rounded-md bg-background"
      />
      {selectedFriends.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFriends.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md text-sm"
            >
              <span>{f.name}</span>
              {onRemove && (
                <button
                  onClick={() => onRemove(f.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <ul className="max-h-64 overflow-y-auto border rounded-md">
        {filtered.length === 0 ? (
          <li className="p-2 text-sm text-muted-foreground text-center">No friends found</li>
        ) : (
          filtered.map((f) => {
            const selected = isSelected(f.id)
            return (
              <li
                key={f.id}
                className={`flex items-center gap-2 p-2 cursor-pointer rounded transition-colors ${
                  selected
                    ? 'bg-primary/10'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleFriendClick(f)}
              >
                <img
                  src={f.avatarUrl || '/placeholder-user.jpg'}
                  alt={f.name}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-user.jpg'
                  }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.email}</div>
                </div>
                {selected && (
                  <span className="text-xs text-primary">✓</span>
                )}
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}

