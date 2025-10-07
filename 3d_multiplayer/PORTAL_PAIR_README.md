# PortalPair Component Documentation

## Overview

The `PortalPair` component manages two linked portals with full bidirectional teleportation functionality. Players can walk through either portal and will be seamlessly teleported to the other portal with proper position and rotation transformation.

## File Location

`/Users/samuellee/projects/3d_multiplayer/src/components/PortalPair.tsx`

## Features Implemented

### 1. Collision Detection
- **Distance-based trigger**: Activates when player is within 2 meters of portal center
- **Frame-by-frame checking**: Uses `useFrame` to check player distance every render frame
- **Cooldown system**: 1-second cooldown prevents infinite teleportation loops
- **Last portal tracking**: Tracks which portal was last used to prevent bouncing

### 2. Teleportation Logic
- **Relative position calculation**: Calculates player position relative to entry portal
- **Position mirroring**: Transforms position through portal plane using quaternion math
- **Camera rotation transformation**: 180° flip around Y-axis maintains view direction
- **Momentum preservation**: Player direction sense is maintained through the portal
- **Smooth transition**: 0.5m forward offset prevents immediate re-trigger

### 3. Portal-to-Portal Rendering
- **See-through effect**: Players can see through portals to the other side
- **Virtual camera**: Each portal renders from linked portal's perspective
- **Performance optimized**: Lower resolution render targets (512x512 desktop, 256x256 mobile)
- **Mobile optimization**: Every-other-frame rendering on mobile devices

## Props Interface

```typescript
interface PortalPairProps {
  // Portal 1 configuration
  portal1Position: [number, number, number];      // World position [x, y, z]
  portal1Rotation?: [number, number, number];     // Euler angles [x, y, z] in radians
  portal1Colors: {
    color1: string;  // Primary color (hex format)
    color2: string;  // Secondary color (hex format)
  };

  // Portal 2 configuration
  portal2Position: [number, number, number];
  portal2Rotation?: [number, number, number];
  portal2Colors: {
    color1: string;
    color2: string;
  };

  // Optional callback
  onTeleport?: (fromPortal: 1 | 2, toPortal: 1 | 2) => void;
}
```

## Usage Examples

### Basic Portal Pair

```tsx
import { PortalPair } from '@/components/PortalPair';

function MyScene() {
  return (
    <PortalPair
      portal1Position={[0, 2, 0]}
      portal1Colors={{ color1: '#00ffff', color2: '#0088ff' }}
      portal2Position={[0, 2, -10]}
      portal2Rotation={[0, Math.PI, 0]}
      portal2Colors={{ color1: '#ff8800', color2: '#ffaa00' }}
    />
  );
}
```

### With Teleport Callback

```tsx
function MyScene() {
  const handleTeleport = (from: 1 | 2, to: 1 | 2) => {
    console.log(`Teleported from portal ${from} to portal ${to}`);
    // Spawn particles, play sound, etc.
  };

  return (
    <PortalPair
      portal1Position={[0, 2, 0]}
      portal1Colors={{ color1: '#00ffff', color2: '#0088ff' }}
      portal2Position={[0, 2, -10]}
      portal2Colors={{ color1: '#ff8800', color2: '#ffaa00' }}
      onTeleport={handleTeleport}
    />
  );
}
```

### Perpendicular Portals

```tsx
// Portal on north wall + portal on east wall
<PortalPair
  portal1Position={[0, 2, -10]}
  portal1Rotation={[0, 0, 0]}
  portal1Colors={{ color1: '#ff0088', color2: '#ff00ff' }}
  portal2Position={[10, 2, 0]}
  portal2Rotation={[0, -Math.PI / 2, 0]}
  portal2Colors={{ color1: '#00ff88', color2: '#00ffaa' }}
/>
```

## Implementation Details

### Collision Detection Algorithm

1. **Every frame** (in `useFrame`):
   - Get player position from camera
   - Calculate distance to portal 1
   - Calculate distance to portal 2
   - Check if distance < 2m and not in cooldown
   - Check if player didn't just use this portal

2. **Cooldown Reset**:
   - If player is >2m from both portals, reset `lastPortalUsed`
   - Allows re-entry after moving away

### Teleportation Mathematics

The teleportation transform uses quaternion math to maintain spatial relationships:

1. **Calculate relative position**:
   ```
   relativePos = playerPos - sourcePortalPos
   ```

2. **Transform to portal local space**:
   ```
   relativePos = relativePos * sourcePortalQuaternion.inverse()
   ```

3. **Apply 180° Y-axis flip** (portal mirroring):
   ```
   relativePos = relativePos * flipQuaternion
   ```

4. **Transform to target portal space**:
   ```
   relativePos = relativePos * targetPortalQuaternion
   ```

5. **Calculate world position**:
   ```
   newPos = targetPortalPos + relativePos + forwardOffset
   ```

6. **Transform camera rotation**:
   ```
   newRotation = cameraRotation * sourceQuat.inverse() * flip * targetQuat
   ```

### Performance Optimizations

1. **No object creation in render loop**:
   - All Vector3/Quaternion objects created once in refs
   - Direct mutation in `useFrame` (R3F best practice)

2. **Render target optimization**:
   - Desktop: 512x512 resolution
   - Mobile: 256x256 resolution
   - Mobile: Every-other-frame rendering

3. **No setState in useFrame**:
   - All state stored in refs
   - No React re-renders triggered

4. **Geometry/material reuse**:
   - Portal component uses `useMemo` for geometries
   - Shader materials cached

## Configuration Constants

```typescript
const COOLDOWN_DURATION = 1.0;  // 1 second cooldown
const TRIGGER_DISTANCE = 2.0;   // 2 meters trigger radius
const FORWARD_OFFSET = 0.5;     // 0.5 meters post-teleport offset
```

To modify these, edit the component file directly.

## Integration with Player Component

The PortalPair automatically accesses the camera from React Three Fiber's context:

```typescript
const { camera, scene } = useThree();
```

No need to pass player ref - it's handled automatically. The camera position is mutated directly for instant teleportation.

## Portal Rendering System

Each portal renders what the other portal sees:

1. **Virtual camera** positioned at target portal
2. **Render target** captures view from virtual camera
3. **Shader** blends render target with animated portal effect
4. **Performance** optimized with lower resolution and frame skipping

## Troubleshooting

### Portals not teleporting

- Check portal positions are correctly specified
- Ensure player can get within 2m of portal center
- Verify camera is at player position (default Player component does this)

### Infinite teleportation loops

- Should not occur with 1-second cooldown
- If it does, increase `COOLDOWN_DURATION`
- Check that `lastPortalUsed` tracking is working

### Performance issues

- Disable portal rendering: set `enablePortalView={false}` on Portal components
- Reduce render target resolution in Portal component
- Check draw call count with r3f-perf

### Portal rotation not working correctly

- Ensure rotations are in radians (not degrees)
- Remember: 180° = Math.PI radians
- Test with simple 0° or Math.PI rotations first

## Technical Notes

### Why Quaternions?

Quaternions avoid gimbal lock and make rotation composition easier. The teleportation transform requires combining multiple rotations, which is cleaner with quaternions than Euler angles.

### Why 180° Flip?

When you walk through a portal, you emerge facing "backward" relative to the portal's normal. The 180° Y-axis flip ensures you exit facing forward from the destination portal's perspective.

### Why Forward Offset?

Without the offset, the player would immediately re-trigger the destination portal, causing a bounce effect. The 0.5m offset moves the player safely past the trigger distance.

## Future Enhancements

Possible improvements for production use:

1. **Configurable trigger distance** via props
2. **Trigger shape** options (sphere, box, plane)
3. **Entry/exit animations** (fade, particles)
4. **Sound effects** integration
5. **Velocity preservation** for physics-based movement
6. **Portal stacking** prevention for multiple portal pairs
7. **One-way portals** option

## Files

- **Component**: `/Users/samuellee/projects/3d_multiplayer/src/components/PortalPair.tsx`
- **Examples**: `/Users/samuellee/projects/3d_multiplayer/src/components/PortalPairExample.tsx`
- **Dependencies**: Portal.tsx, Player.tsx

## Performance Metrics

Expected performance on modern hardware:

- **Desktop**: 60fps with 2 portal pairs, portal rendering enabled
- **Mobile**: 30-60fps with 1 portal pair, reduced quality
- **Draw calls**: +2-4 per portal pair (frame, surface, render target)
- **Memory**: ~2MB per portal pair (render targets)

## License

Part of the 3D Multiplayer project. Use according to project license.
