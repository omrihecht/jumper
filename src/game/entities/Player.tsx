import { useRef, useCallback } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody, CollisionEnterPayload } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { PLAYER, PHYSICS } from '../config/gameConfig';
import { usePlayerController } from '../systems/usePlayerController';
import { useJumpPhysics } from '../systems/useJumpPhysics';
import { useGameStore } from '../state/gameStore';
import { useDevStore } from '../dev/devStore';

export function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const groundContactCount = useRef(0);

  usePlayerController(rigidBodyRef);
  useJumpPhysics(rigidBodyRef);

  useFrame(() => {
    const body = rigidBodyRef.current;
    if (!body) return;
    const damping = useDevStore.getState().physics.playerLinearDamping;
    body.setLinearDamping(damping);
  });

  const onCollisionEnter = useCallback((_payload: CollisionEnterPayload) => {
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
