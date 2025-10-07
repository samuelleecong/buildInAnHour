/**
 * Post-processing effects component using @react-three/postprocessing
 *
 * Features:
 * - Bloom effect: Enhances portal glow and emissive materials (intensity: 0.5, threshold: 0.9, radius: 0.4)
 * - Vignette effect: Adds focus and depth (darkness: 0.5, offset: 0.5)
 * - ChromaticAberration: Optional effect that can be toggled (e.g., during teleport)
 *
 * Usage:
 * ```tsx
 * // Basic usage (already integrated in Scene.jsx)
 * <Canvas>
 *   <YourScene />
 *   <Effects />
 * </Canvas>
 *
 * // With custom props
 * <Effects
 *   enabled={true}
 *   bloomIntensity={0.8}
 *   vignetteIntensity={0.3}
 *   chromaticAberration={isTeleporting}
 * />
 * ```
 *
 * Performance Notes:
 * - Automatically disabled on mobile devices for better performance
 * - Effects are GPU-intensive, consider toggling based on device capabilities
 * - Compatible with the AgXToneMapping tone mapping in Scene.jsx
 */

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useEffect, useState } from 'react';

export interface EffectsProps {
  enabled?: boolean;
  bloomIntensity?: number;
  vignetteIntensity?: number;
  chromaticAberration?: boolean;
}

export default function Effects({
  enabled = true,
  bloomIntensity = 0.5,
  vignetteIntensity = 0.5,
  chromaticAberration = false,
}: EffectsProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    checkMobile();
  }, []);

  // Disable effects on mobile for better performance
  if (!enabled || isMobile) {
    return null;
  }

  return (
    <EffectComposer>
      <>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
          radius={0.4}
          mipmapBlur
        />
        <Vignette
          offset={0.5}
          darkness={vignetteIntensity}
          blendFunction={BlendFunction.NORMAL}
        />
        {chromaticAberration && (
          <ChromaticAberration
            offset={[0.002, 0.002]}
            blendFunction={BlendFunction.NORMAL}
          />
        )}
      </>
    </EffectComposer>
  );
}
