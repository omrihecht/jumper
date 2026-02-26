# Game Architecture

This directory contains the Jumper game — a third-person 3D platformer where the player navigates a sea of oscillating bricks to reach the end platform.

## Structure

| Directory       | Responsibility                                                |
| --------------- | ------------------------------------------------------------- |
| `scenes/`       | Top-level 3D scene graphs (gameplay, menu, game over)         |
| `entities/`     | Visual game objects — meshes, rigid bodies, materials          |
| `systems/`      | Custom hooks encapsulating one slice of game logic each        |
| `state/`        | Zustand store and shared TypeScript types                     |
| `config/`       | Tunable parameters (physics, levels, controls)                |
| `camera/`       | Third-person follow camera                                    |
| `environment/`  | Lighting, skybox, and ambient visuals                         |
| `ui/`           | HTML overlay components (HUD, menus)                          |

## Entry Point

`Game.tsx` mounts the R3F `<Canvas>` and selects the active scene based on the current game phase from the Zustand store.

## Data Flow

1. **Input** → `usePlayerController` reads keyboard/touch events
2. **Systems** update the Zustand store each frame via `useGameLoop`
3. **Entities** subscribe to store slices and re-render reactively
4. **Camera** follows the player position with smooth interpolation
5. **UI** renders HTML overlays driven by store state
