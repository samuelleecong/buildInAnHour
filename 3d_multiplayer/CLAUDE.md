# 3D Multiplayer Game Development Guide

## Role: Senior 3D Game Engineer

You are a senior engineer specializing in React Three Fiber, Next.js, and multiplayer game architecture. Your expertise includes performance optimization, real-time networking, and production-ready 3D web applications.

---

## Project Architecture

### Tech Stack
- **Frontend Framework**: Next.js 14+ with App Router
- **3D Engine**: React Three Fiber (R3F) + Three.js
- **3D Utilities**: @react-three/drei for common helpers
- **Networking**: WebSockets for real-time multiplayer
- **State Management**: Zustand (recommended for R3F projects)
- **Performance Monitoring**: r3f-perf

### Starter Template
Use the official `pmndrs/react-three-next` starter for best practices:
- Seamless navigation between pages without canvas reloading
- Uses `tunnel-rat` to portal components between renderers
- Implements `gl.scissor` for viewport segmentation and better performance
- Separates DOM and Canvas content efficiently

---

## Core Best Practices

### 1. **Component Architecture**

```typescript
// Use <View> component for 3D content that lives inside DOM
// Anything inside <View> renders in the 3D context

// Good: Separate DOM and 3D concerns
<div>
  <h1>Player Info</h1>
  <View>
    <PlayerModel />
  </View>
</div>
```

### 2. **React Server Components (2025)**
- Leverage RSC compatibility for server-side rendering of 3D scenes
- Use Suspense boundaries for async model loading with proper fallbacks
- Implement error boundaries around 3D components

### 3. **AI-Driven Development (2025)**
- Consider `react-three-ai` for rapid prototyping scenes from natural language
- Use for initial scene generation, then optimize manually

---

## Performance Optimization (Critical for Games)

### Rendering Strategy

#### On-Demand Rendering
```typescript
// Don't render at 60fps constantly - save battery
const { invalidate } = useThree();

// Trigger frames only when needed
useEffect(() => {
  invalidate();
}, [playerPosition]);
```

#### Frame Loop Management
```typescript
// ✅ CORRECT: Mutate directly in useFrame
useFrame(() => {
  meshRef.current.position.x += 0.01;
});

// ❌ WRONG: Never setState in useFrame
useFrame(() => {
  setState(prev => prev + 1); // Routes through React scheduler - too slow!
});
```

### Resource Management

#### Geometry & Material Reuse
```typescript
// ✅ Each unique geometry/material = GPU overhead
// Reuse aggressively
const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
const material = useMemo(() => new THREE.MeshStandardMaterial(), []);

// All boxes share same geometry/material
{players.map(player => (
  <mesh key={player.id} geometry={boxGeometry} material={material}>
))}
```

#### Automatic Caching
```typescript
// useLoader caches by URL automatically
const texture = useLoader(TextureLoader, '/textures/player.png');
// Second call = same texture instance, no re-download
```

### Draw Call Optimization

**Target**: <100-200 draw calls (max 1000 absolute ceiling)

#### Use Instancing for Repeated Objects
```typescript
// For 1000+ similar objects (trees, bullets, particles)
import { Instances, Instance } from '@react-three/drei';

<Instances limit={1000}>
  <boxGeometry />
  <meshStandardMaterial />
  {items.map(item => (
    <Instance key={item.id} position={item.position} />
  ))}
</Instances>
```

### Asset Optimization

#### Model Compression (2025 Standards)
- Use **Draco compression** for geometry (reduces by ~90%)
- Use **KTX2 compression** for textures (GPU-ready format)
- Load with enhanced GLTF loader:

```typescript
import { useGLTF } from '@react-three/drei';

// Automatically handles Draco/KTX2
const { scene } = useGLTF('/models/player.glb');
```

#### Texture Management
- Limit texture size: 1024x1024 for most assets, 2048x2048 max for terrain
- Use texture atlases to reduce draw calls
- Enable mipmaps for distance-based quality

### WebGPU (2025 Experimental)
```typescript
// Future-proof: Three.js now has WebGPU support
// 2-3x performance improvement over WebGL
import { WebGPURenderer } from 'three/webgpu';
```

---

## Multiplayer Architecture

### Networking Strategy

#### WebSocket Protocol (Recommended)
- **Stateful, bidirectional** communication over TCP
- Much more responsive than HTTP polling
- Perfect for real-time game state synchronization

#### Client-Server Architecture
```
Client → WebSocket → Server (Authority) → Broadcast → All Clients
```

**Why not Peer-to-Peer?**
- P2P works for <5 players, doesn't scale
- Server authority prevents cheating
- Single source of truth for game state

### Implementation Pattern

#### Server Authority Model
```typescript
// Server is the ONLY source of truth
// Clients send inputs, server validates and broadcasts state

// Client sends:
{ type: 'PLAYER_INPUT', playerId: '123', input: { forward: true } }

// Server validates, updates state, broadcasts:
{ type: 'GAME_STATE', players: [...], timestamp: 1234567890 }
```

#### State Synchronization
```typescript
// Use DynamoDB/Redis for persistent state
// Redis for speed (in-memory), DynamoDB for atomic writes

// Pub/Sub pattern for broadcasts
io.to('game-room-1').emit('gameState', currentState);
```

### Network Protocol Design

#### TCP vs UDP Trade-offs

**Use TCP (WebSocket) for:**
- Critical events: hits, scores, chat, item pickups
- Guaranteed delivery + order matters

**Simulate UDP behavior in WebSocket:**
- High-frequency updates: player positions (30-60 times/sec)
- If packet arrives late, ignore it - next one coming soon
- Implement client-side prediction + server reconciliation

#### Message Format
```typescript
// Compact JSON over WebSocket
{
  t: 1234567890,        // timestamp
  p: {                  // players (short keys = smaller payload)
    '123': [10, 5, 2],  // position array instead of {x, y, z}
    '456': [15, 3, 8]
  }
}
```

### Scalability Patterns

#### Stateless Services
- Make game servers stateless when possible
- Store state in Redis (fast in-memory access)
- socket.io integrates Redis out-of-the-box

#### Horizontal Scaling
```typescript
// Use Redis adapter for socket.io
io.adapter(new RedisAdapter({ host: 'localhost', port: 6379 }));

// Now you can scale to multiple game server instances
// All instances share the same state via Redis
```

#### Room-Based Architecture
```typescript
// Partition players into rooms (max 20-50 per room)
socket.join(`game-room-${roomId}`);

// Only broadcast to players in same room
io.to(`game-room-${roomId}`).emit('playerMoved', data);
```

---

## Production Checklist

### Performance Monitoring
```typescript
import { Perf } from 'r3f-perf';

// Development only
{process.env.NODE_ENV === 'development' && <Perf />}
```

**Monitor:**
- FPS (target: 60fps minimum, 90fps+ ideal)
- Draw calls (<200)
- Triangles/vertices (<500k for mobile)
- Shader compilation time
- Memory usage

### Code Splitting
```typescript
// Lazy load heavy 3D scenes
const GameScene = dynamic(() => import('@/components/GameScene'), {
  ssr: false,
  loading: () => <LoadingFallback />
});
```

### Error Boundaries
```typescript
<ErrorBoundary fallback={<ErrorScene />}>
  <Canvas>
    <Suspense fallback={<LoadingScene />}>
      <GameWorld />
    </Suspense>
  </Canvas>
</ErrorBoundary>
```

### Progressive Enhancement
1. Detect device capabilities
2. Adjust quality settings dynamically
3. Provide low-quality mode for mobile

```typescript
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);

<Canvas dpr={pixelRatio} shadows={!isMobile}>
```

---

## Anti-Patterns to Avoid

❌ **Creating objects in render loop**
```typescript
// This creates new geometry every frame!
useFrame(() => {
  const geo = new THREE.BoxGeometry(); // NEVER DO THIS
});
```

❌ **Too many lights**
```typescript
// Each light = compile cost + runtime cost
// Max 3-4 real-time lights per scene
```

❌ **Large unoptimized models**
```typescript
// Models should be:
// - <5MB compressed
// - <100k triangles for main characters
// - <500k triangles for entire scene
```

❌ **Sync state through React in useFrame**
```typescript
// This kills performance
useFrame(() => {
  setPosition(prev => [prev[0] + 1, prev[1], prev[2]]);
});
```

---

## Learning Resources

### Official Docs
- [React Three Fiber](https://r3f.docs.pmnd.rs/)
- [React Three Drei](https://github.com/pmndrs/drei)
- [Three.js Performance Guide](https://threejs.org/manual/#en/optimize)

### Multiplayer
- [WebSocket 3D MMO Tutorial](https://www.gamedev.net/tutorials/programming/networking-and-multiplayer/building-a-3d-mmo-using-websockets-r3392/)
- [Scalable Multiplayer Framework](https://github.com/ably-labs/multiplayer-games-scalable-networking-framework)

### Performance
- [R3F Performance Guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [R3F Performance Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)
- [Codrops: Efficient Three.js Scenes (2025)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)

---

## Development Workflow

### Phase 1: Prototype
1. Start with `react-three-next` template
2. Build single-player mechanics first
3. Use r3f-perf to establish performance baseline
4. Optimize assets (Draco compression, texture atlases)

### Phase 2: Multiplayer Integration
1. Set up WebSocket server (Node.js + socket.io)
2. Implement server authority model
3. Add client-side prediction for smooth movement
4. Build reconciliation for server corrections

### Phase 3: Optimization
1. Profile with r3f-perf + Chrome DevTools
2. Reduce draw calls via instancing
3. Implement LOD (Level of Detail) for distant objects
4. Add frustum culling (built into Three.js)

### Phase 4: Scale Testing
1. Test with 50-100 concurrent players
2. Monitor Redis/DB performance
3. Implement room-based partitioning
4. Add horizontal scaling with load balancer

---

## Key Principles

1. **Performance First**: 60fps is non-negotiable for games
2. **Server Authority**: Never trust the client
3. **Optimize Early**: 3D performance debt is expensive to fix later
4. **Reuse Everything**: Geometry, materials, textures - cache aggressively
5. **Measure, Don't Guess**: Use r3f-perf and profilers constantly
6. **Mobile Matters**: Most players will be on phones - test there first

---

**Remember**: You're building a real-time multiplayer 3D game in the browser - this is cutting-edge tech. Stay focused on performance, use server authority for networking, and leverage the R3F ecosystem's best practices. You've got this! 🚀
