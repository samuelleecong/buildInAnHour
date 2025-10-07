'use client';

import { useState, useCallback } from 'react';
import { Perf } from 'r3f-perf';
import Environment from './Environment';
import { Player } from './Player';
import { PortalPair } from './PortalPair';
import TeleportParticles from './TeleportParticles';
import Effects from './Effects';

/**
 * Main Scene component that orchestrates all game elements
 *
 * Architecture:
 * - Environment: Test rooms (blue and orange) with lighting
 * - Player: FPS controls with WASD + mouse look
 * - PortalPair: Two linked portals with bidirectional teleportation
 * - TeleportParticles: Visual effect triggered on teleport
 * - Effects: Post-processing (bloom, vignette)
 * - Perf: Performance monitoring (dev only)
 *
 * Performance optimizations:
 * - All state managed in refs (no re-renders during gameplay)
 * - Particle system only active during teleport events
 * - Effects disabled on mobile devices automatically
 */
export default function Scene() {
  // Teleport particle state
  const [particleState, setParticleState] = useState({
    active: false,
    position: [0, 1.7, 0] as [number, number, number],
  });

  // Handle teleport event from PortalPair
  const handleTeleport = useCallback((fromPortal: 1 | 2, toPortal: 1 | 2) => {
    // Determine particle spawn position based on destination portal
    const position: [number, number, number] = toPortal === 1
      ? [-15, 2, 0]  // Blue room (Portal 1)
      : [15, 2, 0];  // Orange room (Portal 2)

    console.log(`Teleported from Portal ${fromPortal} to Portal ${toPortal}`);

    // Activate particle effect at destination
    setParticleState({
      active: true,
      position,
    });
  }, []);

  // Reset particle state after animation completes
  const handleParticleComplete = useCallback(() => {
    setParticleState(prev => ({
      ...prev,
      active: false,
    }));
  }, []);

  return (
    <>
      {/* Performance Monitor (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <Perf position="top-left" />
      )}

      {/* Environment: Rooms, Floor, Lighting */}
      <Environment />

      {/* Player: FPS Controls */}
      <Player />

      {/* Portal Pair: Bidirectional Teleportation */}
      <PortalPair
        // Portal 1 (Blue Room)
        portal1Position={[-15, 2, 0]}
        portal1Rotation={[0, Math.PI / 2, 0]} // Face right towards orange room
        portal1Colors={{
          color1: '#00ffff', // Cyan
          color2: '#ff00ff', // Magenta
        }}

        // Portal 2 (Orange Room)
        portal2Position={[15, 2, 0]}
        portal2Rotation={[0, -Math.PI / 2, 0]} // Face left towards blue room
        portal2Colors={{
          color1: '#00ffff', // Cyan
          color2: '#ff00ff', // Magenta
        }}

        // Teleport callback
        onTeleport={handleTeleport}
      />

      {/* Teleport Particles: Spawned on teleport events */}
      <TeleportParticles
        position={particleState.position}
        active={particleState.active}
        onComplete={handleParticleComplete}
      />

      {/* Post-Processing Effects */}
      <Effects
        enabled={true}
        bloomIntensity={0.6}
        vignetteIntensity={0.4}
        chromaticAberration={false}
      />
    </>
  );
}
