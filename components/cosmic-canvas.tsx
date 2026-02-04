'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import ParticleSystem from './particle-system'
import CosmicPoetry from './cosmic-poetry'
import CosmicUI from './cosmic-ui'

export default function CosmicCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null)
  const [particleCount, setParticleCount] = useState(0)

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setClickPos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen cursor-crosshair relative"
      onClick={handleCanvasClick}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="!bg-background"
      >
        <Physics gravity={[0, -9.8, 0]}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#ff006e" />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#00d9ff" />
          <ParticleSystem
            clickPos={clickPos}
            onParticleCountChange={setParticleCount}
          />
        </Physics>
      </Canvas>

      <CosmicPoetry particleCount={particleCount} clickPos={clickPos} />

      <div className="absolute top-6 left-6 z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Cosmic Canvas
        </h1>
        <p className="text-foreground/50 mt-2 text-sm">
          Click anywhere to create particle explosions
        </p>
      </div>

      <div className="absolute bottom-6 right-6 z-10 text-right">
        <p className="text-foreground/40 text-xs mb-2">
          Active Particles: {particleCount}
        </p>
      </div>

      <CosmicUI />
    </div>
  )
}
