/**
 * MovieMetadata Component
 * 
 * Displays additional movie metadata like production companies,
 * budget, revenue, status, etc.
 * 
 * This component is modular and can be easily extended with more metadata.
 */

'use client'

import React from 'react'
import { Movie } from '@/lib/tmdb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, DollarSign, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { getTMDBImageUrl } from '@/lib/tmdb'

interface MovieMetadataProps {
  movie: Movie
}

export function MovieMetadata({ movie }: MovieMetadataProps) {
  const hasMetadata = 
    movie.production_companies?.length || 
    movie.budget || 
    movie.revenue || 
    movie.status

  if (!hasMetadata) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        {movie.status && (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Status: </span>
              <span className="font-medium">{movie.status}</span>
            </span>
          </div>
        )}

        {/* Budget and Revenue */}
        {(movie.budget || movie.revenue) && (
          <div className="flex items-center gap-4 flex-wrap">
            {movie.budget && movie.budget > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Budget: </span>
                  <span className="font-medium">
                    ${movie.budget.toLocaleString()}
                  </span>
                </span>
              </div>
            )}
            {movie.revenue && movie.revenue > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Revenue: </span>
                  <span className="font-medium">
                    ${movie.revenue.toLocaleString()}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Production Companies */}
        {movie.production_companies && movie.production_companies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Production Companies</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {movie.production_companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md"
                >
                  {company.logo_path && (
                    <div className="relative w-8 h-8">
                      <Image
                        src={getTMDBImageUrl(company.logo_path, 'w92') || ''}
                        alt={company.name}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <span className="text-sm">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

