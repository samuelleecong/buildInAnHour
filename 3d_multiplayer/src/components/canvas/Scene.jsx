'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import * as THREE from 'three'
import dynamic from 'next/dynamic'

// Load Effects component only on client-side to avoid SSR issues with postprocessing
const Effects = dynamic(() => import('@/components/Effects'), { ssr: false })

export default function Scene({ ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props}
      onCreated={(state) => (state.gl.toneMapping = THREE.AgXToneMapping)}
    >
      {/* @ts-ignore */}
      <r3f.Out />
      <Effects />
      <Preload all />
    </Canvas>
  )
}
