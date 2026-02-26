# Entities

Entities are React components that render a single game object. Each entity owns its mesh, material, and (optionally) a Rapier rigid body.

## Existing Entities

| File                | Description                                         |
| ------------------- | --------------------------------------------------- |
| `Player.tsx`        | Player mesh with rigid body and animations          |
| `Brick.tsx`         | Single oscillating brick with kinematic rigid body  |
| `BrickSea.tsx`      | Grid manager that spawns `Brick` instances          |
| `StartPlatform.tsx` | Fixed starting platform                             |
| `EndPlatform.tsx`   | Goal platform that triggers the win condition       |

## Adding a New Entity

1. Create a new `.tsx` file in this directory.
2. Export a React component that returns a `<mesh>` (or group) with appropriate geometry, material, and optional `<RigidBody>`.
3. Accept configuration via props or import from `config/`.
4. Wire the entity into `scenes/GameScene.tsx`.
