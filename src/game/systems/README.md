# Systems

Systems are custom React hooks that encapsulate one slice of game logic. They read/write to the Zustand store and run per-frame via `useFrame` or event listeners.

## Existing Systems

| File                       | Description                                      |
| -------------------------- | ------------------------------------------------ |
| `usePlayerController.ts`   | Maps keyboard/touch input to movement intent     |
| `useJumpPhysics.ts`        | Manages jump arc, gravity, and landing detection |
| `useWaveAnimation.ts`      | Drives sine-wave Y position for bricks           |
| `useCollisionDetection.ts` | Handles player ↔ brick/platform collisions       |
| `useGameLoop.ts`           | Coordinates per-frame updates across systems     |

## Adding a New System

1. Create a new `use<Name>.ts` file in this directory.
2. Import from `state/gameStore` and `config/` as needed.
3. Use `useFrame` from `@react-three/fiber` for per-frame logic.
4. Register the hook inside `useGameLoop` or call it directly in the relevant entity/scene.
