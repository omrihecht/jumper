# Config

All tunable game parameters live here — no magic numbers in game logic.

## Files

| File             | Contents                                                   |
| ---------------- | ---------------------------------------------------------- |
| `gameConfig.ts`  | Physics, movement, jump, camera, player, platform, lighting, environment, death plane |
| `levelConfig.ts` | Per-level definitions: grid size, wave params, colors       |
| `controls.ts`    | Key bindings and reverse lookup map (`KEY_TO_ACTION`)       |

## Adding a Parameter

1. Add the constant to the appropriate section in `gameConfig.ts`.
2. If it should be tunable at runtime, also add it to `dev/devStore.ts`
   and the corresponding dev panel component.

## Adding a Level

Add an entry to the `LEVELS` array in `levelConfig.ts`.
Each level defines grid dimensions, brick spacing/size, wave parameters,
start/end gaps, and brick color.
