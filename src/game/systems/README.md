# Systems

Custom hooks that encapsulate one slice of game logic.
Called inside scene components or entities via `useFrame`.

## Files

| File                       | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| `usePlayerController.ts`   | Keyboard input → player velocity (mutates position in-place) |
| `useJumpPhysics.ts`        | Jump with coyote time and input buffering                  |
| `usePlayerReset.ts`        | Watches resetCount and teleports rigid body to start       |
| `useWaveAnimation.ts`      | Per-brick sine wave Y oscillation                          |
| `useBrickLifecycle.ts`     | Brick grow/shrink/vanish cycle + all material management   |
| `useBrickShadow.ts`        | Player proximity shadow (configurable XZ threshold)        |
| `useBrickHitGlow.ts`       | Collision tracking via ref — no React state, no re-renders |
| `useCollisionDetection.ts` | Death plane check with single-trigger guard                |
| `useGameLoop.ts`           | Frame tick coordinator (calls collision + timer)           |

## Adding a System

1. Create a `use*.ts` hook in this directory.
2. Call it from the relevant entity or scene component.
3. Read/write game state via `useGameStore.getState()` inside `useFrame`.

## Hook Registration Order (Brick)

The order hooks are called in `Brick.tsx` matters because later `useFrame`
callbacks override earlier ones:

```
useWaveAnimation     → sets kinematic body Y position
useBrickHitGlow      → tracks collision state (ref only, no useFrame)
useBrickLifecycle    → overrides body position when vanished,
                       manages all material props (color, emissive, opacity)
useBrickShadow       → controls shadow group visibility and position
```

## Performance Rules

- **Always use `getState()`** inside `useFrame` — never selector hooks.
- **Prefer refs over `useState`** for values that drive imperative updates.
- See the root `game/README.md` for the full performance pitfalls guide.
