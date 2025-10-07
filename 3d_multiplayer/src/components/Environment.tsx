import { useMemo } from 'react';
import * as THREE from 'three';

export default function Environment() {
  // Reuse geometries for performance
  const roomGeometry = useMemo(() => new THREE.BoxGeometry(10, 5, 10), []);
  const floorGeometry = useMemo(() => new THREE.PlaneGeometry(100, 100), []);

  // Reuse materials for performance
  const blueRoomMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e40af',
        emissive: '#1e40af',
        emissiveIntensity: 0.2,
      }),
    []
  );

  const orangeRoomMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ea580c',
        emissive: '#ea580c',
        emissiveIntensity: 0.2,
      }),
    []
  );

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e5e7eb',
        roughness: 0.8,
        metalness: 0.2,
      }),
    []
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {/* Background color */}
      <color attach="background" args={['#87ceeb']} />

      {/* Room 1 - Blue */}
      <mesh
        position={[-15, 2.5, 0]}
        geometry={roomGeometry}
        material={blueRoomMaterial}
        castShadow
      />

      {/* Room 2 - Orange */}
      <mesh
        position={[15, 2.5, 0]}
        geometry={roomGeometry}
        material={orangeRoomMaterial}
        castShadow
      />

      {/* Shared Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        geometry={floorGeometry}
        material={floorMaterial}
        receiveShadow
      />
    </>
  );
}
