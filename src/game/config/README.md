# Config

All tunable game parameters live here so gameplay can be tweaked without touching logic code.

## Files

| File             | Description                                         |
| ---------------- | --------------------------------------------------- |
| `gameConfig.ts`  | Physics, movement, jump, camera, and player params  |
| `levelConfig.ts` | Level definitions (grid size, wave params, colors)   |
| `controls.ts`    | Keyboard key bindings for game actions               |

## Adding a New Parameter

1. Add a named constant to the appropriate config file.
2. Use `as const` for literal types where possible.
3. Import the constant in the system or entity that needs it.

## Adding a New Level

Add an entry to the `LEVELS` array in `levelConfig.ts` following the `LevelConfig` interface. Adjust grid size, wave amplitude/frequency, and brick dimensions to create the desired difficulty.
