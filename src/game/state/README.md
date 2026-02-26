# State

Game state is managed with a single Zustand store. All runtime data (phase, score, player position, etc.) lives here and is shared across systems and entities via selectors.

## Files

| File           | Description                                |
| -------------- | ------------------------------------------ |
| `gameStore.ts` | Zustand store with state + actions          |
| `types.ts`     | TypeScript interfaces for the store shape  |

## Game Phase State Machine

```
Menu → Playing → Won → Menu
                → Lost → Menu
     Playing ↔ Paused
```

## Extending the Store

1. Add the new field to `GameState` in `types.ts`.
2. Add any related actions to `GameActions`.
3. Provide the initial value and action implementations in `gameStore.ts`.
