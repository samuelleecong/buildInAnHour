'use client';

import { Canvas } from '@react-three/fiber';
import Scene from '@/components/Scene';

/**
 * Main page component for the 3D multiplayer portal game
 *
 * Features:
 * - Full viewport Canvas
 * - FPS camera with pointer lock controls
 * - Portal-based teleportation between rooms
 * - Post-processing effects (bloom, vignette)
 * - Performance monitoring in development
 *
 * Controls:
 * - Click canvas to lock pointer (FPS mode)
 * - WASD: Move around
 * - Mouse: Look around
 * - ESC: Exit pointer lock
 *
 * Performance:
 * - Shadows enabled for depth
 * - dpr [1, 2]: Retina display support (capped at 2x for performance)
 * - 75° FOV: Standard FPS field of view
 */
export default function Page() {
  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Instructions Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 1000,
        maxWidth: '300px',
        backdropFilter: 'blur(4px)'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
          Portal Demo
        </h3>
        <div style={{ lineHeight: '1.6' }}>
          <div><strong>Click canvas</strong> to lock pointer</div>
          <div><strong>WASD</strong>: Move</div>
          <div><strong>Mouse</strong>: Look around</div>
          <div><strong>ESC</strong>: Exit pointer lock</div>
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
            Walk through the portals to teleport between the blue and orange rooms!
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: [0, 1.7, 5],  // Start at player eye height (1.7m)
          fov: 75,                 // Standard FPS field of view
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}               // Pixel ratio: 1x default, up to 2x for retina
        gl={{
          antialias: true,
          alpha: false,
          stencil: false,
        }}
      >
        <Scene />
      </Canvas>
    </main>
  );
}
