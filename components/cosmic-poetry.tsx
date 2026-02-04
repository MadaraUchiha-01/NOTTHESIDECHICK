'use client'

import React, { useEffect, useState } from 'react'
import { generatePoetry } from '@/app/actions/generate-poetry'

interface CosmicPoetryProps {
  particleCount: number
  clickPos: { x: number; y: number } | null
}

export default function CosmicPoetry({
  particleCount,
  clickPos,
}: CosmicPoetryProps) {
  const [poetry, setPoetry] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [displayedPoetry, setDisplayedPoetry] = useState<string>('')

  useEffect(() => {
    if (clickPos && particleCount > 0) {
      const generateNewPoetry = async () => {
        setIsLoading(true)
        try {
          const newPoetry = await generatePoetry(particleCount)
          setPoetry(newPoetry)
          // Typewriter effect
          setDisplayedPoetry('')
          let idx = 0
          const interval = setInterval(() => {
            if (idx <= newPoetry.length) {
              setDisplayedPoetry(newPoetry.slice(0, idx))
              idx++
            } else {
              clearInterval(interval)
            }
          }, 20)
        } catch (error) {
          console.error('Failed to generate poetry:', error)
          setDisplayedPoetry(
            'The cosmos whispers in silence, yet speaks in galaxies...'
          )
        } finally {
          setIsLoading(false)
        }
      }

      generateNewPoetry()
    }
  }, [clickPos, particleCount])

  if (!displayedPoetry) {
    return null
  }

  return (
    <div className="absolute bottom-6 left-6 z-10 max-w-md">
      <div className="bg-card/40 backdrop-blur-md rounded-lg p-4 border border-primary/20">
        <p className="text-sm text-foreground/80 leading-relaxed font-light">
          {displayedPoetry}
          {isLoading && <span className="animate-pulse">_</span>}
        </p>
      </div>
    </div>
  )
}
