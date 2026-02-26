# Entities

React components that render a single game object (mesh + rigid body).

## Files

| File               | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `Player.tsx`       | Player cube — delegates to usePlayerController, useJumpPhysics, usePlayerReset, useDevDamping |
| `Brick.tsx`        | Oscillating brick — all visual props managed imperatively (no re-renders on collision) |
| `BrickSea.tsx`     | Grid manager that spawns Brick instances from level config |
| `StartPlatform.tsx`| Spawn platform with shadow and translucent styling       |
| `EndPlatform.tsx`  | Goal platform — triggers win condition (+1 life)         |
| `ShadowGroup.tsx`  | Reusable multi-layer shadow plane group (shared geometry) |

## Adding an Entity

1. Create a component in this directory with a `<RigidBody>` and mesh.
2. Wire it into the appropriate scene in `scenes/`.

## Performance Notes

- **Brick** never re-renders after mount — all dynamic material properties
  (color, emissive, opacity) are managed imperatively by `useBrickLifecycle`.
  The `useBrickHitGlow` hook uses a `ref` (not `useState`) to avoid triggering
  React reconciliation on collision.
- **ShadowGroup** shares a single `PlaneGeometry` across all instances.
  Each layer gets its own `MeshBasicMaterial` since opacity varies per brick.
