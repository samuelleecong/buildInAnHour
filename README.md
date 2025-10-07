# Build In An Hour

> Master complex concepts through AI-accelerated building. One hour. One project. Daily.

Building ambitious projects in **1-hour daily sessions** using **Claude Code** to explore context engineering, AI-native development, and high-velocity learning.

---

## The Challenge

**Constraint:** 1 hour of focused building per day
**Tool:** Claude Code (Anthropic's agentic coding assistant)
**Goal:** Ship production-grade projects while mastering context engineering

### Why This Works

**Traditional Learning:** Read → Struggle → Copy/paste → Forget
**AI-Accelerated:** Research → Context Engineer → AI Generates → Review & Understand → Ship

- 🚀 **10x velocity** - AI handles scaffolding, you focus on architecture
- 🧠 **Learn by reviewing** - Understand patterns as AI explains them
- 🎯 **Ship daily** - Concrete deliverables compound into expertise
- 📈 **Context engineering** - Master the #1 skill for AI-native development

---

## What is Context Engineering?

> The practice of designing what information an AI sees before it generates code.

**Key principle:** *Most AI failures are context failures, not model failures.*

### Techniques Used Here

1. **Structured docs** - PRDs, CLAUDE.md files with role definitions & constraints
2. **Few-shot examples** - Show AI the right patterns (✅ DO / ❌ DON'T)
3. **Compaction** - Summarize learnings in PROJECT_SUMMARY.md between sessions
4. **Tool management** - Clear boundaries for when AI uses which tools
5. **Workflows** - Break complex tasks into focused steps with optimized context

### Resources
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

---

## Projects

| Day | Project | Tech | Status | Key Learning |
|-----|---------|------|--------|--------------|
| 1 | [3D Portal Teleportation](./3d_multiplayer/) | R3F, GLSL, Next.js | ✅ | Custom shaders, spatial transforms, context engineering |

Each project folder contains:
- `PRD.md` - Product requirements (AI blueprint)
- `PROJECT_SUMMARY.md` - What was built, learnings, AI contribution
- `.claude/CLAUDE.md` - Project-specific context for Claude Code

---

## Tech Stack

### Core
- **Next.js 15+** / **TypeScript 5+**
- **Claude Code** - AI pair programming with Sonnet 4.5

### 3D/Game Dev
- **React Three Fiber** / **Three.js**
- **@react-three/drei** / **@react-three/postprocessing**

### Future
- **Socket.io** (multiplayer networking)
- **WebGPU** (next-gen graphics)
- **Redis** (state sync)

---

## Daily Workflow

### Pre-Session (15-30 min) 🧠
**Context engineering phase**
1. Research tech/patterns needed
2. Draft PRD with clear constraints
3. Update `.claude/CLAUDE.md` with:
   - Role definition
   - Anti-patterns to avoid
   - Few-shot examples
   - Success criteria

### Session (60 min) ⚡
1. **Setup** (5 min) - Claude Code scaffolds project
2. **Build** (40 min) - AI generates, you review & refine
3. **Document** (15 min) - AI drafts docs, you validate understanding

### Post-Session (optional) 📝
- Update PROJECT_SUMMARY.md
- Reflect on what worked (improve context for next time)

---

## Learning Objectives

### Meta-Skills (AI-Native Development)
- [x] Context engineering for agentic systems
- [x] Structured documentation for AI consumption
- [x] AI pair programming workflows
- [ ] Advanced prompt engineering
- [ ] Context window management at scale

### Technical Skills
- **Completed:** Custom shaders, 3D math, R3F optimization, WebGL render targets
- **In Progress:** Multiplayer networking, server-authoritative architecture
- **Future:** Physics engines, procedural generation, WebGPU

---

## Rules

### Core Constraint
⏱️ **1 hour max per session** (strict)
- Pre-session research doesn't count (that's context prep)
- AI generates code, you must understand it
- Can extend to 2 hours if in deep flow

### AI Partnership
- **AI generates** → You understand & refine
- **AI explains** → You learn by reviewing
- **AI suggests** → You decide architecture
- **AI handles boilerplate** → You solve novel problems

### Success Metrics
- ✅ Does it work?
- ✅ Do you understand the AI-generated code?
- ✅ Could you rebuild it without AI?
- ❌ Is it pixel-perfect? (not required!)

---

## Project Ideas

**Game Mechanics:** Momentum physics, portal gun, puzzle systems, level editor
**Multiplayer:** WebSocket server, player sync, interpolation, lobbies
**Visuals:** Advanced shaders, dynamic lighting, procedural generation
**Systems:** ECS architecture, inventory, dialogue trees, save systems

---

## Why This Challenge?

After 30 days you'll have:
- ✅ 30 production-grade projects
- ✅ Deep technical expertise
- ✅ Mastery of AI-assisted workflows
- ✅ Context engineering skills (the new superpower)
- ✅ Proven ability to ship under constraints

**The code is AI-assisted. The learning is 100% human. The velocity is 10x.**

---

## Getting Started

```bash
# Clone and explore any project
git clone <repo-url>
cd buildInAnHour/3d_multiplayer
npm install && npm run dev
```

Each project is self-contained with full documentation.

---

**Built with Claude Code. Powered by context engineering.** 🤖✨

> "The new literacy is not coding—it's context engineering. The new velocity is not typing faster—it's thinking clearer."
