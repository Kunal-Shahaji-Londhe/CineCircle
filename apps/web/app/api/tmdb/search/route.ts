/**
 * TMDB Search API Route
 * 
 * Proxies movie search requests to TMDB (or returns mock data if no access token).
 * 
 * TODO: When TMDB_ACCESS_TOKEN is set in .env.local, this will call the real TMDB API.
 */

import { NextResponse } from 'next/server'
import { searchMovies } from '@/lib/tmdb'

/**
 * GET /api/tmdb/search?q=<query>
 * 
 * Searches for movies using the query parameter.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''

  const results = await searchMovies(q)

  return NextResponse.json(results)
}

