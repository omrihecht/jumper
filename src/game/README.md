# Game Module

Root module for the Jumper 3D platformer.

## Structure

| Directory     | Role                                                    |
| ------------- | ------------------------------------------------------- |
| `config/`     | Static tunable parameters (physics, levels, controls)   |
| `state/`      | Zustand store and TypeScript interfaces                 |
| `entities/`   | React components rendering a single game object         |
| `systems/`    | Custom hooks encapsulating one slice of game logic      |
| `camera/`     | Camera controller, debug tracking, and coordinate store |
| `environment/`| Lighting, sky, and starfield background                 |
| `scenes/`     | Scene components that compose entities and systems      |
| `ui/`         | HTML overlays rendered outside the Canvas               |
| `dev/`        | Developer debug panel and runtime parameter hooks       |

## Entry Point

`Game.tsx` mounts the R3F `<Canvas>`, wraps everything in `<Physics>`,
and switches between scenes (`MenuScene`, `GameScene`, `GameOverScene`)
based on the current game phase. It uses static config values for
initial camera/physics props — runtime changes are handled
imperatively by child hooks to avoid full Canvas re-renders.

## Data Flow

```
Keyboard → usePlayerController → mutates player.position in-place
                                → GameCamera reads position via getState()
                                → HUD reads score/lives via selector
gameStore → useJumpPhysics → RigidBody (impulse)
gameStore → useCollisionDetection → loseLife / resetPlayer
EndPlatform collision → winGame (+1 life)

Reset flow (on death):
  resetPlayer() → increments resetCount
    → usePlayerReset detects change → teleports rigid body to start
    → GameCamera detects change → snaps to initial view

Brick visual pipeline (all imperative, no React re-renders):
  useWaveAnimation → sets kinematic Y position
  useBrickLifecycle → scale, opacity fade, hit glow color, body teleport
  useBrickShadow → player proximity shadow
  useBrickHitGlow → tracks collision state via ref (no useState)
```

## Lives System

- Player starts with 3 lives (4 total attempts)
- Falling below the death plane costs 1 life and respawns at start
- Game over triggers only when falling with 0 lives remaining
- Winning a level grants +1 life

## Brick Lifecycle

Each brick cycles through a sine-curve Y-scale over a configurable
duration, then vanishes for a pause before repeating. When vanished,
the rigid body is teleported far below the scene so the player falls
through. Opacity fades to zero as the brick approaches disappearance.

## Performance Principles

See the dedicated **Performance** section below for pitfalls and rules.

---

## Performance: Pitfalls & Rules

### 1. Never call `set()` from `useFrame` unless the value changed

Zustand's `set()` creates a new state slice and notifies all subscribers.
At 60 fps this causes 60 re-renders per second in any subscribing component.

**Rule**: Inside `useFrame`, always guard with a change check:
```ts
// BAD — sets every frame
set({ elapsedTime: s.elapsedTime + delta });

// GOOD — only set when display value changes
if (Math.floor(next * 10) !== Math.floor(s.elapsedTime * 10)) {
  set({ elapsedTime: next });
} else {
  s.elapsedTime = next; // mutate silently
}
```

### 2. Use `getState()` inside `useFrame`, not selector hooks

Selector hooks (`useGameStore((s) => s.foo)`) create React subscriptions.
When multiplied across many instances (e.g., 40 bricks), each subscription
fires on every relevant state change, triggering re-renders.

**Rule**: Inside `useFrame`, always read via `useGameStore.getState()`.
Reserve selector hooks for components that genuinely need to re-render
(UI overlays, phase switches).

### 3. Prefer refs over `useState` for imperative visual changes

`useState` triggers a full React reconciliation of the component and all
children. For per-frame or collision-driven visual changes (color, opacity,
scale), use refs and update Three.js objects directly.

**Rule**: If the change is purely visual and doesn't affect the component
tree structure, use a `useRef` and mutate the material/mesh in `useFrame`.

### 4. Mutate position arrays in-place when no component subscribes

Player position is read by multiple systems via `getState()` but no
React component subscribes to it. Creating a new array + calling `set()`
60x/sec is pure waste.

**Rule**: If no React component subscribes to a store field via selector,
mutate it in place instead of going through `set()`.

### 5. Share geometry and materials across identical instances

Three.js geometry objects consume GPU memory. Creating 126 identical
`PlaneGeometry(1,1)` instances wastes memory.

**Rule**: Hoist shared geometries/materials to module scope.
Per-instance materials are only needed when per-instance properties
(e.g., opacity) are modified independently.

### 6. Don't subscribe to stores at the Canvas/Physics level

Zustand selectors in `Game.tsx` cause the entire R3F tree
(Canvas → Physics → all scenes) to re-mount when the value changes.

**Rule**: `Game.tsx` should only subscribe to `phase` for scene switching.
All other runtime parameter syncing should happen imperatively in child
hooks (`useDevGravity`, `useDevDamping`, `GameCamera` FOV sync).

### 7. Guard boolean setters against no-op updates

`setPlayerGrounded(true)` when already grounded creates a new `player`
object for nothing.

**Rule**: Check the current value before calling `set()`:
```ts
setPlayerGrounded: (isGrounded) => {
  if (useGameStore.getState().player.isGrounded === isGrounded) return;
  set((s) => ({ player: { ...s.player, isGrounded } }));
},
```
