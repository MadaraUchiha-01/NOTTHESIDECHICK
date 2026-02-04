'use client'

import dynamic from 'next/dynamic'

const CosmicCanvas = dynamic(() => import('@/components/cosmic-canvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-foreground/60">Loading the cosmos...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="w-full h-screen bg-background overflow-hidden">
      <CosmicCanvas />
    </main>
  )
}
