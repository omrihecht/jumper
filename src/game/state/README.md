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

## Extending

Add new state fields to `GameState` in `types.ts`, then implement
the corresponding actions in `gameStore.ts`.
