/**
 * TMDB (The Movie Database) API wrapper.
 * 
 * Uses TMDB API v3 with Bearer token authentication.
 * 
 * TODO:
 * 1. Add TMDB_ACCESS_TOKEN to .env.local (get from https://www.themoviedb.org/settings/api)
 * 2. Handle rate limiting and error responses
 */

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || ''
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  overview: string
  backdrop_path?: string | null
  vote_average?: number
  vote_count?: number
}

/**
 * Search for movies using TMDB API.
 * 
 * @param query - Search query string
 * @returns Array of movie objects
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return []

  // If access token is available, use real TMDB API
  if (TMDB_ACCESS_TOKEN) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        console.error('TMDB API error:', response.status, response.statusText)
        return []
      }

      const data = await response.json()
      // TMDB returns results in a 'results' array
      return data.results || []
    } catch (error) {
      console.error('TMDB search error:', error)
      return []
    }
  }

  // Fallback to mock data if no access token
  return [
    {
      id: Math.floor(Math.random() * 100000) + 1000,
      title: `${query} — Mock Movie`,
      poster_path: 'https://via.placeholder.com/200x300?text=Poster',
      release_date: '2023-01-01',
      overview: 'This is a mocked movie used for dev without TMDB access token. Add TMDB_ACCESS_TOKEN to .env.local',
      backdrop_path: null,
      vote_average: 7.5,
      vote_count: 100,
    },
  ]
}

/**
 * Get movie details by ID from TMDB API.
 * 
 * @param id - TMDB movie ID
 * @returns Movie object with full details
 */
export async function getMovieById(id: number): Promise<Movie> {
  // If access token is available, use real TMDB API
  if (TMDB_ACCESS_TOKEN) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('TMDB getMovieById error:', error)
      throw error
    }
  }

  // Return mock data for development
  return {
    id,
    title: `Mock Movie ${id}`,
    poster_path: 'https://via.placeholder.com/200x300?text=Poster',
    release_date: '2023-01-01',
    overview: 'Detailed synopsis for mocked movie. Add TMDB_ACCESS_TOKEN to .env.local for real data.',
    backdrop_path: null,
    vote_average: 7.5,
    vote_count: 100,
  }
}

/**
 * Get the full image URL for a TMDB poster/backdrop path.
 * 
 * @param path - The poster_path or backdrop_path from TMDB
 * @param size - Image size (w200, w300, w500, original, etc.)
 * @returns Full URL to the image
 */
export function getTMDBImageUrl(path: string | null | undefined, size: string = 'w500'): string | null {
  if (!path) return null
  
  // If already a full URL, return as is
  if (path.startsWith('http')) {
    return path
  }

  // Build TMDB image URL
  return `https://image.tmdb.org/t/p/${size}${path}`
}

