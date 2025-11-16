/**
 * Mock Friends API Route
 * 
 * Returns a list of mock friends for development.
 * 
 * TODO: Replace this route with a call to the real friends API endpoint
 * once the friend system is implemented in apps/api.
 */

import { NextResponse } from 'next/server'

const FRIENDS = [
  { id: 'friend_1', name: 'Rohit Sharma', email: 'rohit@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=rohit' },
  { id: 'friend_2', name: 'Priya Singh', email: 'priya@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=priya' },
  { id: 'friend_3', name: 'Aisha Khan', email: 'aisha@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=aisha' },
]

/**
 * GET /api/mock/friends
 * 
 * Returns the list of mock friends.
 */
export async function GET() {
  return NextResponse.json(FRIENDS)
}

