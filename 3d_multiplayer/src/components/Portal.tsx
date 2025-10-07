'use client';

import { useRef, useMemo, RefObject, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Import shaders as raw strings
// Note: You may need to configure Next.js to handle .glsl imports
// For now, we'll inline them. In production, use raw-loader or similar.
const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform sampler2D portalTexture;
uniform float textureOpacity;

varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float dist = length(uv);
  float angle = atan(uv.y, uv.x);

  float spiral = sin(angle * 8.0 + time * 2.0 - dist * 10.0);
  float wave = sin(dist * 15.0 - time * 3.0);
  float pattern = (spiral + wave) * 0.5;

  vec3 color = mix(color1, color2, pattern * 0.5 + 0.5);

  float brightness = 1.0 - smoothstep(0.0, 0.5, dist);
  color *= brightness;

  float glow = 1.0 - smoothstep(0.0, 0.2, dist);
  color += glow * 0.3;

  // Mix in portal texture if available
  vec4 portalView = texture2D(portalTexture, vUv);
  color = mix(color, portalView.rgb, textureOpacity * portalView.a);

  gl_FragColor = vec4(color, 1.0);
}
`;

interface PortalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color1: string;
  color2: string;
  linkedPortalRef?: RefObject<THREE.Group | null>;
  renderScene?: THREE.Scene;
  playerCameraRef?: RefObject<THREE.Camera | null>;
  enablePortalView?: boolean; // Option to disable for performance
}

/**
 * Portal component with animated shader material and pulsating frame
 *
 * Performance optimizations:
 * - Reuses geometries with useMemo
 * - Caches shader uniforms
 * - Uses direct mutation in useFrame (no setState)
 * - Optional portal-to-portal rendering with render targets
 * - Lower resolution render target (512x512) for performance
 * - Graceful fallback to shader-only if portal view disabled
 */
export function Portal({
  position,
  rotation = [0, 0, 0],
  color1,
  color2,
  linkedPortalRef,
  renderScene,
  playerCameraRef,
  enablePortalView = true
}: PortalProps) {
  // Refs for materials to access uniforms
  const portalMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const frameMeshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Get renderer and scene from R3F context
  const { gl, scene: defaultScene } = useThree();

  // Use provided scene or fallback to default
  const sceneToRender = renderScene || defaultScene;

  // Detect if mobile for performance optimizations
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|Android/i.test(navigator.userAgent);
  }, []);

  // Create render target for portal view (lower res on mobile)
  const renderTarget = useMemo(() => {
    if (!enablePortalView || !linkedPortalRef) return null;

    const resolution = isMobile ? 256 : 512;
    return new THREE.WebGLRenderTarget(resolution, resolution, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });
  }, [enablePortalView, linkedPortalRef, isMobile]);

  // Virtual camera for rendering from portal POV
  const virtualCamera = useMemo(() => {
    if (!renderTarget) return null;
    return new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  }, [renderTarget]);

  // Cleanup render target on unmount
  useEffect(() => {
    return () => {
      renderTarget?.dispose();
    };
  }, [renderTarget]);

  // Reuse geometries (avoid creating new ones each render)
  const torusGeometry = useMemo(() =>
    new THREE.TorusGeometry(2, 0.15, 16, 64),
    []
  );

  const circleGeometry = useMemo(() =>
    new THREE.CircleGeometry(2, 64),
    []
  );

  // Convert hex colors to RGB for shader uniforms
  const rgbColor1 = useMemo(() => {
    const color = new THREE.Color(color1);
    return new THREE.Vector3(color.r, color.g, color.b);
  }, [color1]);

  const rgbColor2 = useMemo(() => {
    const color = new THREE.Color(color2);
    return new THREE.Vector3(color.r, color.g, color.b);
  }, [color2]);

  // Create a default black texture for when no portal view is available
  const defaultTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 1, 1);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Shader uniforms (cached to avoid recreation)
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color1: { value: rgbColor1 },
    color2: { value: rgbColor2 },
    portalTexture: { value: renderTarget?.texture || defaultTexture },
    textureOpacity: { value: renderTarget ? 0.7 : 0.0 }, // 70% texture, 30% shader when active
  }), [rgbColor1, rgbColor2, renderTarget, defaultTexture]);

  // Emissive color for frame (same as color1 but with glow)
  const frameColor = useMemo(() => new THREE.Color(color1), [color1]);

  // Frame counter for performance optimization (render every other frame on mobile)
  const frameCounter = useRef(0);

  // Animation loop - mutate directly (R3F best practice)
  useFrame((state, delta) => {
    // Update shader time uniform
    if (portalMaterialRef.current) {
      portalMaterialRef.current.uniforms.time.value += delta;
    }

    // Pulsate frame scale (1.0 → 1.05)
    if (frameMeshRef.current) {
      const pulsate = 1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.025;
      frameMeshRef.current.scale.setScalar(pulsate);
    }

    // Portal-to-portal rendering
    if (renderTarget && virtualCamera && linkedPortalRef?.current && playerCameraRef?.current) {
      frameCounter.current++;

      // On mobile, only update every other frame for performance
      const shouldRender = isMobile ? frameCounter.current % 2 === 0 : true;

      if (shouldRender) {
        const linkedPortal = linkedPortalRef.current;
        const playerCamera = playerCameraRef.current;

        // Calculate virtual camera transform
        // The virtual camera should be positioned at the linked portal
        // and oriented to mirror the player's view relative to this portal

        // Get world positions
        const linkedPortalWorldPos = new THREE.Vector3();
        linkedPortal.getWorldPosition(linkedPortalWorldPos);

        const thisPortalWorldPos = new THREE.Vector3();
        groupRef.current?.getWorldPosition(thisPortalWorldPos);

        const playerWorldPos = new THREE.Vector3();
        playerCamera.getWorldPosition(playerWorldPos);

        // Calculate player position relative to this portal
        const relativePos = playerWorldPos.clone().sub(thisPortalWorldPos);

        // Get portal rotations
        const linkedPortalWorldQuat = new THREE.Quaternion();
        linkedPortal.getWorldQuaternion(linkedPortalWorldQuat);

        const thisPortalWorldQuat = new THREE.Quaternion();
        groupRef.current?.getWorldQuaternion(thisPortalWorldQuat);

        // Calculate rotation difference
        const rotationDiff = linkedPortalWorldQuat.clone().multiply(thisPortalWorldQuat.clone().invert());

        // Position virtual camera at linked portal, offset by relative position
        const virtualCameraPos = linkedPortalWorldPos.clone().add(
          relativePos.clone().applyQuaternion(rotationDiff)
        );
        virtualCamera.position.copy(virtualCameraPos);

        // Orient virtual camera
        const playerQuaternion = new THREE.Quaternion();
        playerCamera.getWorldQuaternion(playerQuaternion);
        virtualCamera.quaternion.copy(playerQuaternion.clone().multiply(rotationDiff));

        // Render from virtual camera perspective to render target
        const currentRenderTarget = gl.getRenderTarget();
        gl.setRenderTarget(renderTarget);
        gl.render(sceneToRender, virtualCamera);
        gl.setRenderTarget(currentRenderTarget);

        // Update texture uniform
        if (portalMaterialRef.current) {
          portalMaterialRef.current.uniforms.portalTexture.value = renderTarget.texture;
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Portal Frame - Torus with emissive material */}
      <mesh ref={frameMeshRef} geometry={torusGeometry}>
        <meshStandardMaterial
          color={frameColor}
          emissive={frameColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Portal Surface - Circle with custom shader */}
      <mesh geometry={circleGeometry}>
        <shaderMaterial
          ref={portalMaterialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
