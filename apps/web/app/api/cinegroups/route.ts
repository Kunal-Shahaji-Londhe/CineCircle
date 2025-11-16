/**
 * CineGroups API Route
 * 
 * Handles GET (list all cinegroups) and POST (create new cinegroup) operations.
 * 
 * Uses file-based persistence in /data/cinegroups.json for development.
 * 
 * TODO: Replace with real backend API calls once apps/api cinegroups endpoints are ready.
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const GROUPS_FILE = path.join(DATA_DIR, 'cinegroups.json')

interface CineGroup {
  id: string
  name: string
  ownerId: string
  memberIds: string[]
  createdAt: string
}

/**
 * Ensures the data directory and groups file exist.
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(GROUPS_FILE)) {
    fs.writeFileSync(GROUPS_FILE, JSON.stringify([], null, 2))
  }
}

/**
 * Reads all cinegroups from the JSON file.
 */
function readGroups(): CineGroup[] {
  ensureDataDir()
  try {
    const content = fs.readFileSync(GROUPS_FILE, 'utf-8')
    return JSON.parse(content) as CineGroup[]
  } catch (error) {
    console.error('Error reading groups:', error)
    return []
  }
}

/**
 * Writes cinegroups to the JSON file.
 */
function writeGroups(groups: CineGroup[]) {
  ensureDataDir()
  fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2))
}

/**
 * GET /api/cinegroups
 * 
 * Returns all cinegroups.
 */
export async function GET() {
  const groups = readGroups()
  return NextResponse.json(groups)
}

/**
 * POST /api/cinegroups
 * 
 * Creates a new cinegroup.
 * 
 * Body: { name: string, ownerId: string, memberIds?: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const groups = readGroups()

    const id = 'cg_' + Math.random().toString(36).slice(2, 9)

    const newGroup: CineGroup = {
      id,
      name: body.name || 'New CineGroup',
      ownerId: body.ownerId,
      memberIds: body.memberIds || [body.ownerId],
      createdAt: new Date().toISOString(),
    }

    groups.push(newGroup)
    writeGroups(groups)

    return NextResponse.json(newGroup, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }
}

