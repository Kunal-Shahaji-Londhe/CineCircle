/**
 * CineBoard API Route (by ID)
 * 
 * Handles GET (get board by ID) and PATCH (update board actions) operations.
 * 
 * Uses file-based persistence in /data/cineboards.json for development.
 * 
 * TODO: Replace with real backend API calls once apps/api cineboards endpoints are ready.
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const BOARDS_FILE = path.join(DATA_DIR, 'cineboards.json')

interface CineBoard {
  id: string
  cinegroupId: string
  movieId: number
  movieSnapshot: any
  senderId: string
  personalMessage?: string
  meta: {
    seenBy: string[]
    watchedBy: string[]
  }
  createdAt: string
}

/**
 * Reads all cineboards from the JSON file.
 */
function readBoards(): CineBoard[] {
  if (!fs.existsSync(BOARDS_FILE)) return []
  try {
    const content = fs.readFileSync(BOARDS_FILE, 'utf-8')
    return JSON.parse(content) as CineBoard[]
  } catch (error) {
    console.error('Error reading boards:', error)
    return []
  }
}

/**
 * Writes cineboards to the JSON file.
 */
function writeBoards(boards: CineBoard[]) {
  const DATA_DIR = path.join(process.cwd(), 'data')
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  fs.writeFileSync(BOARDS_FILE, JSON.stringify(boards, null, 2))
}

/**
 * GET /api/cineboards/[id]
 * 
 * Returns a specific cineboard by ID.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  const { id } = ctx.params
  const boards = readBoards()
  const board = boards.find((b) => b.id === id)

  if (!board) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json(board)
}

/**
 * PATCH /api/cineboards/[id]
 * 
 * Updates a cineboard with actions like marking as watched or seen.
 * 
 * Body: { action: 'mark_watched' | 'start_watching', userId: string }
 */
export async function PATCH(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const { id } = ctx.params
    const body = await req.json()

    const boards = readBoards()
    const idx = boards.findIndex((b) => b.id === id)

    if (idx === -1) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    // Handle actions
    const board = boards[idx]

    if (body.action === 'mark_watched') {
      board.meta.watchedBy = board.meta.watchedBy || []
      if (!board.meta.watchedBy.includes(body.userId)) {
        board.meta.watchedBy.push(body.userId)
      }
    }

    if (body.action === 'start_watching') {
      board.meta.seenBy = board.meta.seenBy || []
      if (!board.meta.seenBy.includes(body.userId)) {
        board.meta.seenBy.push(body.userId)
      }
    }

    boards[idx] = board
    writeBoards(boards)

    return NextResponse.json(board)
  } catch (error) {
    console.error('Error updating board:', error)
    return NextResponse.json({ error: 'Failed to update board' }, { status: 500 })
  }
}

