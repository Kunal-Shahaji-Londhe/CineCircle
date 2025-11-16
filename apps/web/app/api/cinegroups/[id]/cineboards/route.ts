/**
 * CineBoards API Route (by CineGroup)
 * 
 * Handles GET (list boards in a group) and POST (create board in a group) operations.
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
 * Ensures the data directory and boards file exist.
 */
function ensureData() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(BOARDS_FILE)) {
    fs.writeFileSync(BOARDS_FILE, JSON.stringify([], null, 2))
  }
}

/**
 * Reads all cineboards from the JSON file.
 */
function readBoards(): CineBoard[] {
  ensureData()
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
  ensureData()
  fs.writeFileSync(BOARDS_FILE, JSON.stringify(boards, null, 2))
}

/**
 * GET /api/cinegroups/[id]/cineboards
 * 
 * Returns all cineboards for a specific cinegroup.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  const { id: cinegroupId } = ctx.params
  const boards = readBoards().filter((b) => b.cinegroupId === cinegroupId)

  return NextResponse.json(boards)
}

/**
 * POST /api/cinegroups/[id]/cineboards
 * 
 * Creates a new cineboard in a cinegroup.
 * 
 * Body: { movieId: number, movieSnapshot: any, senderId: string, personalMessage?: string }
 */
export async function POST(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const { id: cinegroupId } = ctx.params
    const body = await req.json()

    const boards = readBoards()

    // Duplicate prevention: cinegroupId + movieId
    const exists = boards.find(
      (b) => b.cinegroupId === cinegroupId && b.movieId === body.movieId
    )

    if (exists) {
      return NextResponse.json({ error: 'duplicate' }, { status: 409 })
    }

    const newBoard: CineBoard = {
      id: 'cb_' + Math.random().toString(36).slice(2, 9),
      cinegroupId,
      movieId: body.movieId,
      movieSnapshot: body.movieSnapshot,
      senderId: body.senderId,
      personalMessage: body.personalMessage || '',
      meta: { seenBy: [], watchedBy: [] },
      createdAt: new Date().toISOString(),
    }

    boards.push(newBoard)
    writeBoards(boards)

    return NextResponse.json(newBoard, { status: 201 })
  } catch (error) {
    console.error('Error creating board:', error)
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 })
  }
}

