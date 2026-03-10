# Entities

React components that render a single game object (mesh + rigid body).

## Files

| File               | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `Player.tsx`       | Player cube — delegates to usePlayerController, useJumpPhysics, usePlayerReset, useDevDamping |
| `Brick.tsx`        | Oscillating brick — all visual props managed imperatively (no re-renders on collision) |
| `BrickSea.tsx`     | Grid manager that spawns Brick instances from level config |
| `StartPlatform.tsx`| Cylindrical spawn platform with glow effect              |
| `EndPlatform.tsx`  | Cylindrical goal platform — triggers win condition (+1 life) |
| `ShadowGroup.tsx`  | Reusable multi-layer shadow plane group (shared geometry) |

## Adding an Entity

1. Create a component in this directory with a `<RigidBody>` and mesh.
2. Wire it into the appropriate scene in `scenes/`.

## Performance Notes

- **Brick** never re-renders after mount — all dynamic material properties
  (color, emissive, opacity) are managed imperatively by `useBrickLifecycle`.
  The `useBrickHitGlow` hook uses a `ref` (not `useState`) to avoid triggering
  React reconciliation on collision.
- **Brick edge material** (`LineBasicMaterial`) is shared across all
  instances via a module-scope constant, avoiding per-brick duplication.
- **ShadowGroup** shares a single `PlaneGeometry` across all instances.
  Each layer gets its own `MeshBasicMaterial` since opacity varies per brick.
- **Platforms** use `CylinderGeometry` with `CylinderCollider` for accurate
  physics and high emissive intensity for a glowing effect.
