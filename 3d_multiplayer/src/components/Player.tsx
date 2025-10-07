'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';

interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export function Player() {
  const controlsRef = useRef<PointerLockControlsImpl>(null);
  const { camera } = useThree();

  // Store keyboard state in ref to avoid re-renders
  const keyboardState = useRef<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Movement speed (5 m/s)
  const MOVE_SPEED = 5;

  // Camera height (1.7m above ground)
  const CAMERA_HEIGHT = 1.7;

  // Reusable vectors for movement calculation (avoid creating in useFrame)
  const moveDirection = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());

  // Set initial camera height
  useEffect(() => {
    camera.position.y = CAMERA_HEIGHT;
  }, [camera]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          keyboardState.current.forward = true;
          break;
        case 'KeyS':
          keyboardState.current.backward = true;
          break;
        case 'KeyA':
          keyboardState.current.left = true;
          break;
        case 'KeyD':
          keyboardState.current.right = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          keyboardState.current.forward = false;
          break;
        case 'KeyS':
          keyboardState.current.backward = false;
          break;
        case 'KeyA':
          keyboardState.current.left = false;
          break;
        case 'KeyD':
          keyboardState.current.right = false;
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Movement logic in render loop
  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const { forward, backward, left, right } = keyboardState.current;

    // Calculate movement direction based on camera orientation
    frontVector.current.set(0, 0, Number(backward) - Number(forward));
    sideVector.current.set(Number(left) - Number(right), 0, 0);

    // Combine vectors and normalize
    moveDirection.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(MOVE_SPEED * delta);

    // Apply movement relative to camera direction
    moveDirection.current.applyEuler(camera.rotation);

    // Mutate camera position directly (R3F best practice)
    camera.position.x += moveDirection.current.x;
    camera.position.z += moveDirection.current.z;

    // Keep camera at constant height
    camera.position.y = CAMERA_HEIGHT;
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      // Pointer lock activates on click
      selector="canvas"
    />
  );
}
