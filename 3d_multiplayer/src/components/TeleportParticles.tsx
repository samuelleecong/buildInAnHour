'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TeleportParticlesProps {
  position: [number, number, number];
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  velocity: THREE.Vector3;
  lifetime: number;
  maxLifetime: number;
  initialSize: number;
}

const PARTICLE_COUNT = 100;
const PARTICLE_LIFETIME = 1.0; // seconds
const PARTICLE_SPEED = 3.0;
const PARTICLE_COLOR = new THREE.Color(0x00ffff); // Cyan

export default function TeleportParticles({
  position,
  active,
  onComplete
}: TeleportParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isActiveRef = useRef(false);
  const hasCompletedRef = useRef(false);

  // Create geometry with preallocated buffers
  const { geometry, positionsArray, sizesArray, alphasArray } = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Preallocate typed arrays for performance
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const alphas = new Float32Array(PARTICLE_COUNT);

    // Initialize all particles at origin (will be updated on spawn)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      sizes[i] = 0.2;
      alphas[i] = 0; // Start invisible
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    return {
      geometry: geo,
      positionsArray: positions,
      sizesArray: sizes,
      alphasArray: alphas
    };
  }, []);

  // Custom shader material for size and alpha control
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: PARTICLE_COLOR }
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        varying float vAlpha;

        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;

        void main() {
          // Circular particle shape
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;

          // Soft edge
          float alpha = (1.0 - dist * 2.0) * vAlpha;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, []);

  // Initialize particle data (velocities, lifetimes)
  const initializeParticles = () => {
    particlesRef.current = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random spherical distribution for spawn direction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      ).multiplyScalar(PARTICLE_SPEED);

      particlesRef.current.push({
        velocity,
        lifetime: 0,
        maxLifetime: PARTICLE_LIFETIME,
        initialSize: 0.15 + Math.random() * 0.15 // 0.15-0.3 size variation
      });

      // Set initial positions at spawn point
      positionsArray[i * 3] = position[0];
      positionsArray[i * 3 + 1] = position[1];
      positionsArray[i * 3 + 2] = position[2];

      // Start fully opaque
      alphasArray[i] = 1.0;
      sizesArray[i] = particlesRef.current[i].initialSize;
    }

    // Mark buffer attributes as needing update
    if (pointsRef.current) {
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.alpha.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;
    }
  };

  // Trigger particle spawn when active becomes true
  useEffect(() => {
    if (active && !isActiveRef.current) {
      isActiveRef.current = true;
      hasCompletedRef.current = false;
      initializeParticles();
    }
  }, [active, position]);

  // Animation loop
  useFrame((state, delta) => {
    if (!isActiveRef.current || !pointsRef.current) return;

    let allDead = true;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = particlesRef.current[i];

      // Update lifetime
      particle.lifetime += delta;

      if (particle.lifetime < particle.maxLifetime) {
        allDead = false;

        // Update position based on velocity
        positionsArray[i * 3] += particle.velocity.x * delta;
        positionsArray[i * 3 + 1] += particle.velocity.y * delta;
        positionsArray[i * 3 + 2] += particle.velocity.z * delta;

        // Calculate normalized lifetime (0 to 1)
        const lifetimeRatio = particle.lifetime / particle.maxLifetime;

        // Fade out alpha over lifetime
        alphasArray[i] = 1.0 - lifetimeRatio;

        // Shrink size over lifetime
        sizesArray[i] = particle.initialSize * (1.0 - lifetimeRatio * 0.5);
      } else {
        // Particle is dead, make it invisible
        alphasArray[i] = 0;
        sizesArray[i] = 0;
      }
    }

    // Mark attributes for GPU update
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.alpha.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;

    // All particles expired
    if (allDead && !hasCompletedRef.current) {
      isActiveRef.current = false;
      hasCompletedRef.current = true;
      onComplete?.();
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
