# State

Zustand store managing all runtime game state, decoupled from rendering.

## Files

| File           | Description                                        |
| -------------- | -------------------------------------------------- |
| `types.ts`     | TypeScript interfaces: `GamePhase`, `PlayerState`, `GameState`, `GameActions` |
| `gameStore.ts` | Zustand store with phase transitions, lives, respawn, scoring |

## Game Phase State Machine

```
[*] → Menu
Menu → Playing (startGame — lives reset to 3)
Playing → Paused (pauseGame)
Paused → Playing (resumeGame)
Playing → Won (winGame — triggered by EndPlatform collision, +1 life)
Playing → Playing (loseLife when lives > 0 — respawn via resetCount)
Playing → Lost (loseLife when lives = 0)
Won / Lost → Menu (returnToMenu)
```

## Performance Notes

- **Player position** is mutated in-place (not via `set()`) because no
  React component subscribes to it. Systems read it via `getState()`.
- **`tick()`** only calls `set()` when the displayed time (0.1s precision)
  changes — silently mutates `elapsedTime` on intermediate frames.
- **`setPlayerGrounded` / `setPlayerJumping`** check the current value
  before calling `set()` to avoid creating new state objects for no-ops.

## Extending

Add new state fields to `GameState` in `types.ts`, then implement
the corresponding actions in `gameStore.ts`. If the field is only
read imperatively (via `getState()`), consider mutating in-place
instead of going through `set()` to avoid unnecessary re-renders.
