# State

Zustand store managing all runtime game state, decoupled from rendering.

## Files

| File           | Description                                        |
| -------------- | -------------------------------------------------- |
| `types.ts`     | TypeScript interfaces: `GamePhase`, `PlayerState`, `GameState`, `GameActions` |
| `gameStore.ts` | Zustand store with phase transitions, player state, scoring |

## Game Phase State Machine

```
[*] → Menu
Menu → Playing (startGame)
Playing → Paused (pauseGame)
Paused → Playing (resumeGame)
Playing → Won (winGame — triggered by EndPlatform collision)
Playing → Lost (loseLife when lives reach 0)
Won / Lost → Menu (returnToMenu)
```

## Extending

Add new state fields to `GameState` in `types.ts`, then implement
the corresponding actions in `gameStore.ts`.
