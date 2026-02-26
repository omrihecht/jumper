import { RigidBody } from '@react-three/rapier';
import { PLATFORM } from '../config/gameConfig';
import { useGameStore } from '../state/gameStore';

/**
 * Goal platform at the far end of the brick sea.
 * Position is derived from the current level config.
 */
export function EndPlatform() {
  const level = useGameStore((s) => s.currentLevel);
  const z = -(level.startGap + level.gridRows * level.brickSpacing + level.endGap);

  return (
    <RigidBody type="fixed" position={[0, 0, z]} colliders="cuboid">
      <mesh receiveShadow>
        <boxGeometry args={[...PLATFORM.endSize]} />
        <meshStandardMaterial
          color={PLATFORM.endColor}
          emissive={PLATFORM.endColor}
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
    </RigidBody>
  );
}
