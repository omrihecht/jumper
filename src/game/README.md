# Game Module

Root module for the Jumper 3D platformer.

## Structure

| Directory      | Role                                                    |
| -------------- | ------------------------------------------------------- |
| `config/`      | Static tunable parameters (physics, levels, controls)   |
| `state/`       | Zustand store, TypeScript interfaces, screen sync hook  |
| `entities/`    | React components rendering a single game object         |
| `systems/`     | Custom hooks encapsulating one slice of game logic      |
| `camera/`      | Camera controller, auto-pan, debug tracking             |
| `environment/` | Lighting, sky, starfield, confetti, level title          |
| `scenes/`      | 3D scene components (menu, gameplay, game-over, you-win)|
| `screens/`     | Route-level UI overlays rendered via React Router        |
| `ui/`          | HTML overlays rendered outside the Canvas               |
| `dev/`         | Developer debug panel and runtime parameter hooks       |

## Entry Point

`GameLayout.tsx` mounts the R3F `<Canvas>`, wraps everything in `<Physics>`,
and renders `<SceneSwitch>` which picks the correct 3D scene based on
`currentScreen` from the Zustand store. The layout uses `<Outlet>` so
each route's screen component (MenuScreen, PlayScreen, etc.) renders
its HTML overlay on top.

The single shared Canvas ensures the WebGL context is never destroyed
during route transitions.

## Routing

Top-level screens are managed by React Router (not Zustand phase):

| Route        | Screen Component | 3D Scene      |
| ------------ | ---------------- | ------------- |
| `/`          | MenuScreen       | MenuScene     |
| `/play`      | PlayScreen       | GameScene     |
| `/game-over` | GameOverScreen   | GameOverScene |
| `/you-win`   | YouWinScreen     | YouWinScene   |

The `useScreenSync` hook ensures the Zustand `currentScreen` stays
in sync with the mounted route — critical for correct scene rendering
on page refresh.

`navigation.ts` exposes `navigateTo()` for imperative navigation
from R3F hooks (which live outside the React Router tree).

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

Zustand selectors in `GameLayout.tsx` cause the entire R3F tree
(Canvas → Physics → all scenes) to re-mount when the value changes.

**Rule**: `GameLayout.tsx` should use static config constants.
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

### 8. Memoize list-rendered components

Components rendered in a loop (e.g., `Brick` inside `BrickSea`) should
be wrapped in `React.memo` so parent re-renders (level transitions)
don't reconcile unchanged children.
