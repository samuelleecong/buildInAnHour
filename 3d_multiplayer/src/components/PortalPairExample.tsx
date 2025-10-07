'use client';

import { PortalPair } from './PortalPair';

/**
 * Example usage of PortalPair component
 *
 * This demonstrates how to set up two linked portals with teleportation
 */
export function PortalPairExample() {
  // Callback for teleportation events (e.g., spawn particles, play sound)
  const handleTeleport = (fromPortal: 1 | 2, toPortal: 1 | 2) => {
    console.log(`Teleported from Portal ${fromPortal} to Portal ${toPortal}`);
    // You could trigger particle effects, sounds, or other visual feedback here
  };

  return (
    <PortalPair
      // Position portal 1 at origin
      portal1Position={[0, 2, 0]}
      // Face portal 1 towards positive Z
      portal1Rotation={[0, 0, 0]}
      // Blue/cyan color scheme for portal 1
      portal1Colors={{
        color1: '#00ffff',  // Cyan
        color2: '#0088ff',  // Blue
      }}

      // Position portal 2 10 meters away on the Z axis
      portal2Position={[0, 2, -10]}
      // Face portal 2 towards positive Z (180° turn so it faces back towards portal 1)
      portal2Rotation={[0, Math.PI, 0]}
      // Orange/yellow color scheme for portal 2
      portal2Colors={{
        color1: '#ff8800',  // Orange
        color2: '#ffaa00',  // Yellow-orange
      }}

      // Optional: callback for teleportation events
      onTeleport={handleTeleport}
    />
  );
}

/**
 * Example: Portals on perpendicular walls
 */
export function PerpendicularPortalsExample() {
  return (
    <PortalPair
      // Portal 1 on north wall
      portal1Position={[0, 2, -10]}
      portal1Rotation={[0, 0, 0]}
      portal1Colors={{
        color1: '#ff0088',
        color2: '#ff00ff',
      }}

      // Portal 2 on east wall (90° rotation)
      portal2Position={[10, 2, 0]}
      portal2Rotation={[0, -Math.PI / 2, 0]}
      portal2Colors={{
        color1: '#00ff88',
        color2: '#00ffaa',
      }}
    />
  );
}

/**
 * Example: Multiple portal pairs in the same scene
 */
export function MultiplePortalPairsExample() {
  return (
    <>
      {/* First portal pair - Blue theme */}
      <PortalPair
        portal1Position={[-5, 2, 0]}
        portal1Rotation={[0, Math.PI / 2, 0]}
        portal1Colors={{ color1: '#0088ff', color2: '#00ffff' }}
        portal2Position={[5, 2, 0]}
        portal2Rotation={[0, -Math.PI / 2, 0]}
        portal2Colors={{ color1: '#0088ff', color2: '#00ffff' }}
      />

      {/* Second portal pair - Red theme */}
      <PortalPair
        portal1Position={[0, 2, 10]}
        portal1Rotation={[0, Math.PI, 0]}
        portal1Colors={{ color1: '#ff0000', color2: '#ff4444' }}
        portal2Position={[0, 2, -10]}
        portal2Rotation={[0, 0, 0]}
        portal2Colors={{ color1: '#ff0000', color2: '#ff4444' }}
      />
    </>
  );
}
