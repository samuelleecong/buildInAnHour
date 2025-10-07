# Product Requirements Document: Portal Teleportation System

## Overview

A visually stunning 3D portal teleportation system built with React Three Fiber and Next.js. This project serves as both a showcase piece and foundational mechanic for future 3D multiplayer game development.

**Estimated Development Time:** 3 hours
**Target Performance:** 60 FPS
**Tech Stack:** Next.js 14+, React Three Fiber, Three.js, TypeScript

---

## Objectives

### Primary Goals
1. Create visually impressive portal effects using custom shaders
2. Implement seamless teleportation between 3D spaces
3. Build reusable portal system for future game mechanics
4. Learn advanced shader programming techniques

### Secondary Goals
1. Establish foundation for spatial puzzle mechanics
2. Demonstrate production-ready 3D web development
3. Optimize for performance across devices

---

## Features

### Core Features (MVP)

#### 1. Portal Visual System
- **Custom Shader Material**
  - Fresnel effect for edge glow
  - Swirling noise animation
  - Gradient color mixing (configurable colors)
  - Semi-transparent effect (alpha: 0.8-1.0)
  - Time-based animation

- **Portal Geometry**
  - Torus frame (outer ring)
  - Circular portal surface
  - Emissive frame material
  - Configurable size (default: 2m radius)

#### 2. Teleportation Mechanics
- **Collision Detection**
  - Distance-based trigger (< 2m from portal center)
  - Player velocity consideration
  - Cooldown system (1 second) to prevent loops

- **Position Transfer**
  - Relative position calculation
  - Position mirroring through portal plane
  - Camera rotation transformation (180° flip)
  - Smooth transition (no jarring jumps)

- **Portal Pairs**
  - Bidirectional linking (A ↔ B)
  - Support for multiple independent pairs
  - Configurable link relationships

#### 3. Player Controller
- **First-Person Controls**
  - WASD movement
  - Mouse look (pointer lock)
  - Configurable movement speed (5 m/s)
  - Smooth camera motion

#### 4. Environment
- **Test Rooms**
  - Room 1: Blue theme (#1e40af)
  - Room 2: Orange theme (#ea580c)
  - Distinct visual identity for orientation
  - Basic geometry (10x5x10m boxes)

- **Shared Elements**
  - Floor plane (100x100m)
  - Ambient lighting
  - Skybox or solid background

### Enhanced Features (Time Permitting)

#### 5. Portal-to-Portal Rendering
- Render target setup (512x512)
- Virtual camera positioned at linked portal
- Real-time view through portal
- Performance optimization (lower resolution)

#### 6. Visual Effects
- **Teleport Particles**
  - 100 particle burst on teleport
  - Cyan color (#00ffff)
  - Radial spawn pattern
  - 1-second lifetime

- **Post-Processing**
  - Bloom effect (intensity: 0.5)
  - Vignette (darkness: 0.5)
  - Optional: chromatic aberration during teleport

#### 7. Audio & Feedback
- Teleport whoosh sound effect
- Screen shake (0.2s duration)
- Camera FOV pulse during teleport

---

## Technical Architecture

### Project Structure
```
src/
├── app/
│   └── page.tsx                 # Main page with Canvas
├── components/
│   ├── Scene.tsx                # Main 3D scene orchestrator
│   ├── Portal.tsx               # Individual portal component
│   ├── PortalPair.tsx           # Linked portal pair manager
│   ├── Player.tsx               # FPS controller
│   ├── Environment.tsx          # Test rooms and environment
│   ├── TeleportParticles.tsx    # Particle effect system
│   └── Effects.tsx              # Post-processing effects
└── shaders/
    ├── portalVertex.glsl        # Portal vertex shader
    └── portalFragment.glsl      # Portal fragment shader
```

### Key Technologies
- **react-three-next**: Optimized R3F + Next.js starter
- **@react-three/drei**: Helper components (PointerLockControls, etc.)
- **@react-three/postprocessing**: Bloom, vignette effects
- **zustand**: State management (if needed for complex interactions)
- **three**: Core 3D library

---

## Implementation Plan

### Phase 1: Foundation (45 minutes)

**Task 1.1: Project Setup (15min)**
- Initialize react-three-next starter
- Install dependencies
- Configure TypeScript
- Setup project structure

**Task 1.2: FPS Controls (15min)**
- Implement Player component
- Add PointerLockControls
- WASD movement logic
- Mouse look integration

**Task 1.3: Basic Scene (15min)**
- Create Environment component
- Build two test rooms with distinct colors
- Add floor plane
- Setup lighting (ambient + directional)

**Deliverable:** Navigable 3D space with two rooms

---

### Phase 2: Portal Shader Magic (75 minutes)

**Task 2.1: Portal Geometry (15min)**
- Create Portal component
- Add torus frame geometry
- Create circular portal surface
- Add emissive material to frame

**Task 2.2: Custom Shader Material (45min)**
- Write vertex shader (UV, normal, position passing)
- Implement fragment shader:
  - Fresnel calculation for edge glow
  - Simplex noise function
  - UV displacement for swirling effect
  - Color gradient mixing
  - Time-based animation
- Create shaderMaterial with uniforms
- Extend R3F with custom material

**Task 2.3: Animate Shader (15min)**
- Add useFrame hook for time uniform
- Connect shader animation to render loop
- Test color variations
- Optimize shader performance

**Deliverable:** Animated, visually stunning portal effect

---

### Phase 3: Teleportation Logic (45 minutes)

**Task 3.1: Collision Detection (20min)**
- Create PortalPair component
- Implement distance-based collision check
- Add cooldown timer (1 second)
- Handle both portal entries

**Task 3.2: Teleport Transform (25min)**
- Calculate relative player position
- Implement position mirroring
- Transform camera rotation (180° flip)
- Maintain player momentum/direction sense
- Trigger particle effects
- Test edge cases

**Deliverable:** Functional bidirectional teleportation

---

### Phase 4: Portal-to-Portal View (30 minutes)

**Task 4.1: Render Target Setup (20min)**
- Create WebGLRenderTarget (512x512)
- Setup virtual camera
- Position camera at linked portal
- Render scene from portal POV each frame

**Task 4.2: Apply as Texture (10min)**
- Add render target as shader uniform
- Mix portal texture with shader effect (70/30 blend)
- Optimize render frequency if needed

**Deliverable:** See-through portals showing destination

---

### Phase 5: Polish (30 minutes)

**Task 5.1: Particles (15min)**
- Create TeleportParticles component
- Generate 100 random particle positions
- Add spawn/despawn animation
- Trigger on teleport event
- Configure color and size

**Task 5.2: Post-Processing (15min)**
- Setup EffectComposer
- Add Bloom effect (intensity: 0.5)
- Add Vignette effect (darkness: 0.5)
- Test performance impact
- Adjust parameters for visual quality

**Deliverable:** Polished, game-ready portal system

---

### Phase 6: Testing & Optimization (15 minutes)

**Testing Checklist:**
- [ ] Forward portal entry → correct teleport
- [ ] Backward portal entry → correct teleport
- [ ] Cooldown prevents infinite loops
- [ ] Camera orientation feels natural
- [ ] Portal-to-portal view works correctly
- [ ] Shader animates smoothly (no stutter)
- [ ] Particles spawn on teleport
- [ ] Performance: 60fps maintained
- [ ] Multiple portal pairs work independently
- [ ] No memory leaks during repeated teleports

**Optimization Tasks:**
- Profile with r3f-perf
- Check draw call count (target: <100)
- Verify shader compilation time
- Test on lower-end devices
- Optimize render target resolution if needed

---

## Performance Targets

### Frame Rate
- **Desktop:** 60 FPS minimum
- **Mobile:** 30 FPS minimum (with reduced effects)

### Resource Budgets
- **Draw Calls:** <100 per frame
- **Triangles:** <50k total
- **Texture Memory:** <20MB
- **Shader Compilation:** <500ms

### Optimization Strategies
1. Reuse geometry/materials across portal pairs
2. Lower render target resolution (256x256 on mobile)
3. Disable portal-to-portal rendering on low-end devices
4. Reduce particle count on mobile (50 instead of 100)
5. Disable post-processing on mobile

---

## Visual Impact Maximizers

### Color Palette Recommendations
- **Portal Pair 1:** Cyan (#00ffff) ↔ Magenta (#ff00ff)
- **Portal Pair 2:** Blue (#0066ff) ↔ Orange (#ff6600)
- **Portal Pair 3:** Green (#00ff66) ↔ Purple (#9900ff)

### Enhancement Ideas
1. **Audio:** Whoosh sound on teleport (150ms duration)
2. **Screen Shake:** 0.2s subtle shake on teleport
3. **FOV Pulse:** Zoom FOV from 75→65→75 over 0.3s
4. **Chromatic Aberration:** Distortion effect during teleport
5. **Light Emission:** Portal frames emit colored light affecting environment

### Polish Details
- Portal frame pulsates subtly (scale: 1.0 → 1.05)
- Particle trails follow player through portal
- Floor reflects portal glow
- Room walls have subtle texture/normal maps

---

## Code Quality Standards

### Performance
- No object creation in `useFrame` loops
- Reuse geometries and materials via `useMemo`
- Cache shader uniforms
- Use `useLoader` for texture caching

### Code Organization
- One component per file
- Shared types in `types.ts`
- Shader code in separate `.glsl` files
- Clear prop interfaces with TypeScript

### Best Practices
- Follow R3F performance guidelines
- Avoid setState in render loops
- Use direct mutation in `useFrame`
- Implement proper cleanup in useEffect

---

## Success Metrics

### Functional Requirements
✅ Player can walk through portals
✅ Teleportation feels smooth and natural
✅ Portal effects are visually impressive
✅ System supports multiple portal pairs
✅ Performance maintains 60 FPS

### Visual Requirements
✅ Shader effects are animated and dynamic
✅ Portal-to-portal view works (if time permits)
✅ Particle effects enhance teleportation
✅ Post-processing adds polish
✅ Environment clearly distinguishes locations

### Technical Requirements
✅ Code is modular and reusable
✅ TypeScript types are complete
✅ No memory leaks during gameplay
✅ Works on both desktop and mobile
✅ Follows R3F best practices

---

## Future Enhancements

### Gameplay Mechanics
- Momentum preservation through portals
- Object/physics body teleportation
- Portal gun for dynamic placement
- Portal size/shape variations
- One-way portals
- Timed/conditional portals

### Visual Upgrades
- More complex shader effects (distortion, refraction)
- Higher resolution render targets (1024x1024)
- Recursive portal rendering (portals within portals)
- Environmental reflections in portals
- Dynamic portal colors based on destination

### Multiplayer Integration
- Sync portal states across clients
- Animate other players teleporting
- Server-authoritative teleportation
- Network prediction for smooth experience

### Level Design
- Puzzle mechanics using portals
- Multiple interconnected rooms
- Vertical portal placement
- Moving/rotating portals

---

## Risk Mitigation

### Technical Risks

**Risk:** Shader complexity causes performance issues
**Mitigation:** Start with simple shader, add effects incrementally, profile frequently

**Risk:** Portal-to-portal rendering too expensive
**Mitigation:** Make it optional, use low resolution, limit update frequency

**Risk:** Teleportation feels disorienting
**Mitigation:** Add clear visual cues, test rotation angles, implement smooth transitions

**Risk:** Time overrun
**Mitigation:** Follow phase structure strictly, skip Phase 4/5 if needed, focus on core mechanics first

### Scope Risks

**Risk:** Feature creep during development
**Mitigation:** Stick to MVP features, document future enhancements separately

**Risk:** Debugging takes longer than expected
**Mitigation:** Use console logs liberally, implement helper visualizations (arrows, distance indicators)

---

## Development Tips

### Time Savers
- Use `@react-three/drei` helpers aggressively
- Copy noise functions from existing shader libraries
- Test with huge portals initially (easier collision testing)
- Start with 1 portal pair, clone when working
- Skip render-to-texture initially if time-constrained

### Debugging Strategies
- Console.log distances for collision tuning
- Add visual helpers (arrows showing portal direction)
- Use r3f-perf to monitor performance in real-time
- Test in isolation (portals without teleport, then add logic)

### Visual Debugging
- Make portal frames bright/emissive during development
- Add coordinate axis helpers at portal positions
- Display player distance to nearest portal in UI
- Show cooldown timer visually

---

## Learning Outcomes

By completing this project, you will gain expertise in:

1. **Custom Shader Development**
   - Writing GLSL vertex/fragment shaders
   - Implementing noise functions
   - Creating time-based animations
   - Understanding Fresnel effects

2. **3D Math & Transforms**
   - Position/rotation calculations
   - Matrix transformations
   - Relative coordinate systems
   - Vector mathematics

3. **R3F Advanced Patterns**
   - useFrame for render loops
   - Custom shader materials
   - Render targets for portal views
   - Performance optimization techniques

4. **Game Mechanics**
   - Collision detection
   - State machines (cooldowns)
   - Camera manipulation
   - Spatial reasoning

5. **Production Workflow**
   - Incremental feature development
   - Performance profiling
   - Cross-device testing
   - Code organization at scale

---

## Resources

### Official Documentation
- [React Three Fiber Docs](https://r3f.docs.pmnd.rs/)
- [Three.js Shader Materials](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [GLSL Reference](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)

### Learning Materials
- [The Book of Shaders](https://thebookofshaders.com/) - Noise functions
- [R3F Performance Guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Drei Helpers](https://github.com/pmndrs/drei) - PointerLockControls, etc.

### Inspiration
- Portal (Valve) - Original game mechanic
- Antichamber - Non-euclidean spaces
- Superliminal - Perspective puzzles

---

## Conclusion

This portal teleportation system balances visual impressiveness with technical learning and reusability. The 3-hour timeline is achievable by focusing on core features first and adding polish incrementally.

**Key Success Factors:**
- Stick to the phase timeline strictly
- Profile performance early and often
- Make it work, then make it pretty
- Document learnings for future multiplayer integration

**Next Steps After Completion:**
1. Add multiplayer synchronization
2. Build puzzle mechanics around portals
3. Create level editor for portal placement
4. Integrate with game progression system

---

**Status:** Ready for Development
**Last Updated:** 2025-10-06
**Version:** 1.0
