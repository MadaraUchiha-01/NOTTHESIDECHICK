'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

interface Particle {
  id: string
  position: [number, number, number]
  velocity: [number, number, number]
  color: THREE.Color
  scale: number
  age: number
  maxAge: number
}

interface ParticleSystemProps {
  clickPos: { x: number; y: number } | null
  onParticleCountChange: (count: number) => void
}

const PARTICLE_COLORS = [
  '#ff006e', // hot pink
  '#00d9ff', // cyan
  '#ff9500', // orange
  '#a78bfa', // purple
  '#10b981', // emerald
  '#f472b6', // pink
  '#06b6d4', // sky
]

export default function ParticleSystem({
  clickPos,
  onParticleCountChange,
}: ParticleSystemProps) {
  const particlesRef = useRef<Map<string, Particle>>(new Map())
  const groupRef = useRef<THREE.Group>(null)
  const meshesRef = useRef<Map<string, THREE.InstancedMesh>>(new Map())
  const particleIdRef = useRef(0)

  const createParticles = (clickPosition: { x: number; y: number }) => {
    const particleCount = 20 + Math.random() * 15

    const centerX = (clickPosition.x - 0.5) * 20
    const centerY = (0.5 - clickPosition.y) * 12

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 8 + Math.random() * 12
      const elevation = Math.random() * Math.PI

      const particle: Particle = {
        id: `particle-${particleIdRef.current++}`,
        position: [centerX, centerY, (Math.random() - 0.5) * 4],
        velocity: [
          Math.cos(angle) * Math.sin(elevation) * speed,
          Math.sin(angle) * speed,
          Math.cos(elevation) * speed,
        ],
        color: new THREE.Color(
          PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
        ),
        scale: 0.15 + Math.random() * 0.1,
        age: 0,
        maxAge: 3 + Math.random() * 2,
      }

      particlesRef.current.set(particle.id, particle)
    }
  }

  useFrame(() => {
    const particles = particlesRef.current
    const deltaTime = 0.016 // ~60fps

    // Update particles
    particles.forEach((particle) => {
      particle.age += deltaTime
      particle.velocity[1] -= 9.8 * deltaTime // gravity

      particle.position[0] += particle.velocity[0] * deltaTime
      particle.position[1] += particle.velocity[1] * deltaTime
      particle.position[2] += particle.velocity[2] * deltaTime

      // Air resistance
      particle.velocity[0] *= 0.98
      particle.velocity[1] *= 0.98
      particle.velocity[2] *= 0.98
    })

    // Remove old particles
    const toRemove: string[] = []
    particles.forEach((particle, id) => {
      if (particle.age > particle.maxAge) {
        toRemove.push(id)
      }
    })
    toRemove.forEach((id) => particles.delete(id))

    // Update meshes
    if (groupRef.current && particles.size > 0) {
      particles.forEach((particle, id) => {
        let mesh = meshesRef.current.get(id)

        if (!mesh) {
          const geom = new THREE.IcosahedronGeometry(1, 2)
          const mat = new THREE.MeshPhongMaterial({
            color: particle.color,
            emissive: particle.color,
            emissiveIntensity: 0.6,
          })
          mesh = new THREE.Mesh(geom, mat)
          groupRef.current?.add(mesh)
          meshesRef.current.set(id, mesh)
        }

        mesh.position.set(...particle.position)
        mesh.scale.setScalar(particle.scale)

        // Fade out effect
        const progress = particle.age / particle.maxAge
        if (mesh.material instanceof THREE.MeshPhongMaterial) {
          mesh.material.opacity = Math.max(0, 1 - progress * 1.5)
          mesh.material.transparent = true
        }
      })
    }

    // Cleanup removed meshes
    meshesRef.current.forEach((mesh, id) => {
      if (!particles.has(id)) {
        groupRef.current?.remove(mesh)
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose())
        } else {
          mesh.material.dispose()
        }
        meshesRef.current.delete(id)
      }
    })

    onParticleCountChange(particles.size)
  })

  useEffect(() => {
    if (clickPos) {
      createParticles(clickPos)
    }
  }, [clickPos])

  return (
    <group ref={groupRef}>
      {/* Static particle renderer - particles are added dynamically */}
    </group>
  )
}
