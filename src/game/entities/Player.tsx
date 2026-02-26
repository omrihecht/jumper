import { useRef, useCallback } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { PLAYER, PHYSICS } from '../config/gameConfig';
import { usePlayerController } from '../systems/usePlayerController';
import { useJumpPhysics } from '../systems/useJumpPhysics';
import { usePlayerReset } from '../systems/usePlayerReset';
import { useDevDamping } from '../dev/useDevDamping';
import { useGameStore } from '../state/gameStore';

export function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const groundContactCount = useRef(0);

  usePlayerController(rigidBodyRef);
  useJumpPhysics(rigidBodyRef);
  usePlayerReset(rigidBodyRef, groundContactCount);
  useDevDamping(rigidBodyRef);

  const onCollisionEnter = useCallback(() => {
    groundContactCount.current++;
    useGameStore.getState().setPlayerGrounded(true);
  }, []);

  const onCollisionExit = useCallback(() => {
    groundContactCount.current = Math.max(0, groundContactCount.current - 1);
    if (groundContactCount.current === 0) {
      useGameStore.getState().setPlayerGrounded(false);
    }
  }, []);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[...PLAYER.startPosition]}
      mass={PHYSICS.playerMass}
      linearDamping={PHYSICS.playerLinearDamping}
      angularDamping={PHYSICS.playerAngularDamping}
      lockRotations
      colliders="cuboid"
      onCollisionEnter={onCollisionEnter}
      onCollisionExit={onCollisionExit}
    >
      <mesh castShadow>
        <boxGeometry args={[...PLAYER.size]} />
        <meshStandardMaterial
          color={PLAYER.color}
          emissive={PLAYER.color}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </RigidBody>
  );
}
