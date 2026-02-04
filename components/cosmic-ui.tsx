'use client'

import React, { useState, useEffect } from 'react'

export default function CosmicUI() {
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {showHint && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="bg-gradient-to-r from-primary to-accent p-1 rounded-lg">
            <div className="bg-background px-6 py-3 rounded-md text-center">
              <p className="text-sm font-medium text-foreground animate-pulse">
                Click to create cosmic explosions
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-6 right-6 z-10 space-y-2">
        <div className="text-xs text-foreground/40 space-y-1">
          <p>🖱️ Click anywhere</p>
          <p>✨ Watch particles explode</p>
          <p>✍️ AI poetry appears</p>
        </div>
      </div>
    </>
  )
}
