# Entities

React components that render a single game object (mesh + rigid body).

## Files

| File               | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `Player.tsx`       | Player cube with physics body, respawn on resetCount     |
| `Brick.tsx`        | Oscillating brick with hit glow and player shadow        |
| `BrickSea.tsx`     | Grid manager that spawns Brick instances from level config |
| `StartPlatform.tsx`| Spawn platform with shadow and translucent styling       |
| `EndPlatform.tsx`  | Goal platform — triggers win condition (+1 life)         |
| `ShadowGroup.tsx`  | Reusable multi-layer shadow plane group                  |

## Adding an Entity

1. Create a component in this directory with a `<RigidBody>` and mesh.
2. Wire it into the appropriate scene in `scenes/`.
