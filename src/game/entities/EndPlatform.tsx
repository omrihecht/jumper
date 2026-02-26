import { useCallback } from 'react';
import { RigidBody } from '@react-three/rapier';
import { PLATFORM } from '../config/gameConfig';
import { useGameStore } from '../state/gameStore';

/**
 * Goal platform at the far end of the brick sea.
 * Triggers the win condition when the player lands on it.
 */
export function EndPlatform() {
  const level = useGameStore((s) => s.currentLevel);
  const z = -(level.startGap + level.gridRows * level.brickSpacing + level.endGap);

  const onCollisionEnter = useCallback(() => {
    const { phase, winGame } = useGameStore.getState();
    if (phase === 'playing') winGame();
  }, []);

  return (
    <RigidBody
      type="fixed"
      position={[0, 0, z]}
      colliders="cuboid"
      onCollisionEnter={onCollisionEnter}
    >
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
