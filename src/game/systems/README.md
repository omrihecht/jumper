# Systems

Custom hooks that encapsulate one slice of game logic.
Called inside scene components or entities via `useFrame`.

## Files

| File                       | Description                                         |
| -------------------------- | --------------------------------------------------- |
| `usePlayerController.ts`   | Keyboard input → player velocity                    |
| `useJumpPhysics.ts`        | Jump with coyote time and input buffering           |
| `useWaveAnimation.ts`      | Per-brick sine wave Y oscillation                   |
| `useCollisionDetection.ts` | Death plane check with single-trigger guard          |
| `useGameLoop.ts`           | Frame tick coordinator (calls collision + timer)    |
| `useBrickShadow.ts`        | Player proximity shadow (configurable XZ threshold) |
| `useBrickHitGlow.ts`       | Neon color glow when player lands on a brick        |

## Adding a System

1. Create a `use*.ts` hook in this directory.
2. Call it from the relevant entity or scene component.
3. Read/write game state via `useGameStore.getState()` inside `useFrame`.
