'use client';

import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import { PortalPair } from './PortalPair';
import Environment from './Environment';
import { Perf } from 'r3f-perf';

/**
 * Test scene for PortalPair component
 *
 * This creates a simple test environment with:
 * - Ground plane
 * - Two portals 10 meters apart
 * - Player controls
 * - Performance monitoring
 */
export function PortalPairTest() {
  const handleTeleport = (from: 1 | 2, to: 1 | 2) => {
    console.log(`[PortalPairTest] Teleported from Portal ${from} to Portal ${to}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 1.7, 5], fov: 75 }}
        shadows
      >
        {/* Performance monitoring (development only) */}
        {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Environment (ground, sky) */}
        <Environment />

        {/* Player controls */}
        <Player />

        {/* Portal pair - Blue and Orange theme */}
        <PortalPair
          // Blue portal at origin
          portal1Position={[0, 2, 0]}
          portal1Rotation={[0, 0, 0]}
          portal1Colors={{
            color1: '#00ffff',  // Cyan
            color2: '#0088ff',  // Blue
          }}

          // Orange portal 10m away
          portal2Position={[0, 2, -10]}
          portal2Rotation={[0, Math.PI, 0]}  // Facing back towards portal 1
          portal2Colors={{
            color1: '#ff8800',  // Orange
            color2: '#ffaa00',  // Yellow-orange
          }}

          onTeleport={handleTeleport}
        />

        {/* Visual markers to help test positioning */}
        {/* Red cube at origin */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>

        {/* Green cube at portal 2 location */}
        <mesh position={[0, 0.5, -10]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#00ff00" />
        </mesh>

        {/* Guide markers every 2 meters */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[0, 0.1, -i * 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </Canvas>

      {/* Instructions overlay */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '14px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '5px',
          pointerEvents: 'none',
        }}
      >
        <div><strong>Portal Test Scene</strong></div>
        <div>Click to lock pointer</div>
        <div>WASD - Move</div>
        <div>Mouse - Look around</div>
        <div>Walk through portals to test teleportation</div>
        <div style={{ marginTop: '10px', color: '#00ffff' }}>Blue Portal: Origin (0, 2, 0)</div>
        <div style={{ color: '#ff8800' }}>Orange Portal: (0, 2, -10)</div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>
          Trigger distance: 2m | Cooldown: 1s
        </div>
      </div>
    </div>
  );
}

/**
 * Advanced test scene with multiple portal pairs
 */
export function MultiPortalTest() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 1.7, 5], fov: 75 }}>
        {process.env.NODE_ENV === 'development' && <Perf />}

        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Environment />
        <Player />

        {/* Portal pair 1: North-South corridor */}
        <PortalPair
          portal1Position={[0, 2, 10]}
          portal1Rotation={[0, Math.PI, 0]}
          portal1Colors={{ color1: '#ff0088', color2: '#ff00ff' }}
          portal2Position={[0, 2, -10]}
          portal2Rotation={[0, 0, 0]}
          portal2Colors={{ color1: '#ff0088', color2: '#ff00ff' }}
        />

        {/* Portal pair 2: East-West corridor */}
        <PortalPair
          portal1Position={[-10, 2, 0]}
          portal1Rotation={[0, Math.PI / 2, 0]}
          portal1Colors={{ color1: '#00ff88', color2: '#00ffaa' }}
          portal2Position={[10, 2, 0]}
          portal2Rotation={[0, -Math.PI / 2, 0]}
          portal2Colors={{ color1: '#00ff88', color2: '#00ffaa' }}
        />

        {/* Center marker */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '14px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '5px',
          pointerEvents: 'none',
        }}
      >
        <div><strong>Multi-Portal Test</strong></div>
        <div style={{ marginTop: '10px', color: '#ff00ff' }}>Pink Portals: N-S Axis</div>
        <div style={{ color: '#00ffaa' }}>Green Portals: E-W Axis</div>
      </div>
    </div>
  );
}

/**
 * Stress test with perpendicular portals
 */
export function PerpendicularPortalTest() {
  const handleTeleport = (from: 1 | 2, to: 1 | 2) => {
    console.log(`Perpendicular teleport: ${from} -> ${to}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 1.7, 5], fov: 75 }}>
        {process.env.NODE_ENV === 'development' && <Perf />}

        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Environment />
        <Player />

        {/* Portal on north wall facing south */}
        {/* Portal on east wall facing west */}
        <PortalPair
          portal1Position={[0, 2, -8]}
          portal1Rotation={[0, 0, 0]}
          portal1Colors={{ color1: '#0088ff', color2: '#00ffff' }}
          portal2Position={[8, 2, 0]}
          portal2Rotation={[0, -Math.PI / 2, 0]}
          portal2Colors={{ color1: '#ff8800', color2: '#ffaa00' }}
          onTeleport={handleTeleport}
        />

        {/* Wall indicators */}
        <mesh position={[0, 2, -8.5]} rotation={[0, 0, 0]}>
          <planeGeometry args={[5, 4]} />
          <meshStandardMaterial color="#333333" side={2} />
        </mesh>

        <mesh position={[8.5, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[5, 4]} />
          <meshStandardMaterial color="#333333" side={2} />
        </mesh>
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '14px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '5px',
          pointerEvents: 'none',
        }}
      >
        <div><strong>Perpendicular Portal Test</strong></div>
        <div style={{ marginTop: '10px' }}>Tests 90° rotation transform</div>
        <div style={{ color: '#00ffff' }}>Blue: North Wall</div>
        <div style={{ color: '#ff8800' }}>Orange: East Wall</div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>
          Camera should rotate 90° when teleporting
        </div>
      </div>
    </div>
  );
}
