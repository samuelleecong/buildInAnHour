'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Portal } from './Portal';

interface PortalPairProps {
  portal1Position: [number, number, number];
  portal2Position: [number, number, number];
  portal1Rotation?: [number, number, number];
  portal2Rotation?: [number, number, number];
  portal1Colors: { color1: string; color2: string };
  portal2Colors: { color1: string; color2: string };
  onTeleport?: (fromPortal: 1 | 2, toPortal: 1 | 2) => void;
}

/**
 * PortalPair component manages two linked portals with bidirectional teleportation
 *
 * Features:
 * - Distance-based collision detection (< 2m trigger distance)
 * - Cooldown system (1 second) to prevent infinite loops
 * - Relative position calculation and mirroring
 * - Camera rotation transformation (180° Y-axis flip)
 * - Smooth teleportation with forward offset
 * - Portal-to-portal rendering (see through portals to the other side)
 *
 * Performance optimizations:
 * - All calculations in useFrame using direct mutation
 * - Reuses Vector3/Euler objects in refs (no object creation in render loop)
 * - No setState in useFrame
 * - Lower resolution render targets (512x512 desktop, 256x256 mobile)
 * - Every-other-frame rendering on mobile devices
 */
export function PortalPair({
  portal1Position,
  portal2Position,
  portal1Rotation = [0, 0, 0],
  portal2Rotation = [0, 0, 0],
  portal1Colors,
  portal2Colors,
  onTeleport,
}: PortalPairProps) {
  const { camera, scene } = useThree();

  // Refs for portal groups to enable portal-to-portal rendering
  const portal1Ref = useRef<THREE.Group>(null);
  const portal2Ref = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.Camera>(camera);

  // Teleportation state (using refs to avoid re-renders in useFrame)
  const lastTeleportTime = useRef(0);
  const lastPortalUsed = useRef<1 | 2 | null>(null);
  const COOLDOWN_DURATION = 1.0; // 1 second cooldown
  const TRIGGER_DISTANCE = 2.0; // 2 meters

  // Reusable objects for calculations (avoid creating in useFrame)
  const portal1PosVector = useRef(new THREE.Vector3(...portal1Position));
  const portal2PosVector = useRef(new THREE.Vector3(...portal2Position));
  const tempVector = useRef(new THREE.Vector3());
  const relativePosition = useRef(new THREE.Vector3());
  const newPosition = useRef(new THREE.Vector3());
  const portal1Quaternion = useRef(new THREE.Quaternion());
  const portal2Quaternion = useRef(new THREE.Quaternion());
  const inverseQuaternion = useRef(new THREE.Quaternion());
  const flipQuaternion = useRef(new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    Math.PI // 180 degrees
  ));

  // Initialize portal rotations as quaternions
  useRef(() => {
    const euler1 = new THREE.Euler(...portal1Rotation);
    const euler2 = new THREE.Euler(...portal2Rotation);
    portal1Quaternion.current.setFromEuler(euler1);
    portal2Quaternion.current.setFromEuler(euler2);
  }).current;

  // Update portal positions if they change
  portal1PosVector.current.set(...portal1Position);
  portal2PosVector.current.set(...portal2Position);

  // Teleportation logic in render loop
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime;

    // Check cooldown
    if (currentTime - lastTeleportTime.current < COOLDOWN_DURATION) {
      return;
    }

    // Get player position (camera position)
    tempVector.current.copy(camera.position);

    // Calculate distances to both portals
    const distanceToPortal1 = tempVector.current.distanceTo(portal1PosVector.current);
    const distanceToPortal2 = tempVector.current.distanceTo(portal2PosVector.current);

    // Check if player is within trigger distance of either portal
    if (distanceToPortal1 < TRIGGER_DISTANCE && lastPortalUsed.current !== 1) {
      // Teleport from Portal 1 to Portal 2
      teleportPlayer(1, 2, currentTime);
    } else if (distanceToPortal2 < TRIGGER_DISTANCE && lastPortalUsed.current !== 2) {
      // Teleport from Portal 2 to Portal 1
      teleportPlayer(2, 1, currentTime);
    }

    // Reset last portal used if player is far from both portals
    if (distanceToPortal1 > TRIGGER_DISTANCE && distanceToPortal2 > TRIGGER_DISTANCE) {
      lastPortalUsed.current = null;
    }
  });

  /**
   * Teleports player from one portal to another
   * @param fromPortal - Source portal (1 or 2)
   * @param toPortal - Destination portal (1 or 2)
   * @param currentTime - Current elapsed time for cooldown
   */
  function teleportPlayer(fromPortal: 1 | 2, toPortal: 1 | 2, currentTime: number) {
    const sourcePos = fromPortal === 1 ? portal1PosVector.current : portal2PosVector.current;
    const targetPos = fromPortal === 1 ? portal2PosVector.current : portal1PosVector.current;
    const sourceQuat = fromPortal === 1 ? portal1Quaternion.current : portal2Quaternion.current;
    const targetQuat = fromPortal === 1 ? portal2Quaternion.current : portal1Quaternion.current;

    // Calculate relative position from source portal
    relativePosition.current.copy(camera.position).sub(sourcePos);

    // Transform relative position through portal rotation
    // First, get inverse of source portal rotation
    inverseQuaternion.current.copy(sourceQuat).invert();
    relativePosition.current.applyQuaternion(inverseQuaternion.current);

    // Apply 180° flip around Y-axis (portal mirroring)
    relativePosition.current.applyQuaternion(flipQuaternion.current);

    // Apply target portal rotation
    relativePosition.current.applyQuaternion(targetQuat);

    // Calculate new world position
    newPosition.current.copy(targetPos).add(relativePosition.current);

    // Add small offset in the portal's forward direction to prevent immediate re-trigger
    const offset = new THREE.Vector3(0, 0, 0.5); // 0.5m forward offset
    offset.applyQuaternion(targetQuat);
    newPosition.current.add(offset);

    // Apply new position to camera
    camera.position.copy(newPosition.current);

    // Transform camera rotation (180° flip around Y-axis)
    const currentQuaternion = new THREE.Quaternion().setFromEuler(camera.rotation);

    // Remove source portal rotation, apply flip, apply target portal rotation
    currentQuaternion
      .premultiply(inverseQuaternion.current)
      .premultiply(flipQuaternion.current)
      .premultiply(targetQuat);

    // Apply new rotation to camera
    camera.rotation.setFromQuaternion(currentQuaternion);

    // Update cooldown state
    lastTeleportTime.current = currentTime;
    lastPortalUsed.current = toPortal;

    // Trigger callback for effects/particles
    if (onTeleport) {
      onTeleport(fromPortal, toPortal);
    }
  }

  return (
    <group>
      {/* Portal 1 - linked to Portal 2 */}
      <group ref={portal1Ref}>
        <Portal
          position={portal1Position}
          rotation={portal1Rotation}
          color1={portal1Colors.color1}
          color2={portal1Colors.color2}
          linkedPortalRef={portal2Ref}
          renderScene={scene}
          playerCameraRef={cameraRef}
          enablePortalView={true}
        />
      </group>

      {/* Portal 2 - linked to Portal 1 */}
      <group ref={portal2Ref}>
        <Portal
          position={portal2Position}
          rotation={portal2Rotation}
          color1={portal2Colors.color1}
          color2={portal2Colors.color2}
          linkedPortalRef={portal1Ref}
          renderScene={scene}
          playerCameraRef={cameraRef}
          enablePortalView={true}
        />
      </group>
    </group>
  );
}
