# Game Module

Root module for the Jumper 3D platformer.

## Structure

| Directory     | Role                                                    |
| ------------- | ------------------------------------------------------- |
| `config/`     | Static tunable parameters (physics, levels, controls)   |
| `state/`      | Zustand store and TypeScript interfaces                 |
| `entities/`   | React components rendering a single game object         |
| `systems/`    | Custom hooks encapsulating one slice of game logic      |
| `camera/`     | Camera controller and debug coordinate store            |
| `environment/`| Lighting and background                                 |
| `scenes/`     | Scene components that compose entities and systems      |
| `ui/`         | HTML overlays rendered outside the Canvas               |
| `dev/`        | Developer debug panel for runtime parameter tuning      |

## Entry Point

`Game.tsx` mounts the R3F `<Canvas>`, wraps everything in `<Physics>`,
and switches between scenes (`MenuScene`, `GameScene`, `GameOverScene`)
based on the current game phase.

## Data Flow

```
Keyboard → usePlayerController → gameStore → Player (position)
                                           → GameCamera (Z-follow)
                                           → HUD (score, lives)
gameStore → useJumpPhysics → RigidBody (impulse)
gameStore → useCollisionDetection → loseLife / resetPlayer
EndPlatform collision → winGame
```
