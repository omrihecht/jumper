import { RigidBody } from '@react-three/rapier';
import { PLATFORM } from '../config/gameConfig';

/**
 * Fixed starting platform where the player spawns.
 */
export function StartPlatform() {
  return (
    <RigidBody type="fixed" position={[0, 0, 0]} colliders="cuboid">
      <mesh receiveShadow>
        <boxGeometry args={[...PLATFORM.startSize]} />
        <meshStandardMaterial
          color={PLATFORM.startColor}
          emissive={PLATFORM.startColor}
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
    </RigidBody>
  );
}
