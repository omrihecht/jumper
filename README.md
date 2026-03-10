# Jumper

A third-person 3D platformer where the player jumps across a sea of sine-wave-oscillating bricks to reach the end platform. Built with React Three Fiber on React 19 + Vite + TypeScript.

**[Play it live](https://omrihecht.github.io/jumper/)**

## Quick Start

```sh
npm install
npx nx serve
```

Production build:

```sh
npx nx build
```

Output lands in `dist/jumper`.

## Tech Stack

| Library | Role |
| --- | --- |
| React Three Fiber | Declarative 3D scene graph |
| @react-three/drei | Camera controls, helpers |
| @react-three/rapier | WASM physics engine |
| Zustand | Lightweight state management |
| SCSS Modules | Scoped styling with variables and nesting |
| Vite 7 + TypeScript | Build tooling |
| Nx | Task orchestration |

## Game Mechanics

- **Movement** — Arrow keys / WASD, Space to jump, Shift to sprint
- **Lives** — 3 lives at start (4 total attempts); falling costs 1 life, winning a level grants +1
- **Levels** — 3 levels of increasing difficulty (wider grid, faster waves, smaller bricks)
- **Win** — Land on the end platform to advance; complete all 3 levels to win
- **Game over** — Fall with 0 lives remaining

## Architecture

See the in-app [Architecture Docs](/jumper/docs) or browse the `README.md` files inside each `src/game/` subdirectory.

```
src/game/
├── config/       # Static tunable parameters
├── state/        # Zustand store and types
├── entities/     # Game object components
├── systems/      # Custom hooks for game logic
├── camera/       # Camera controller
├── environment/  # Lighting, sky, starfield
├── scenes/       # Scene composition
├── ui/           # HTML overlays
└── dev/          # Debug panel
```

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml`.
