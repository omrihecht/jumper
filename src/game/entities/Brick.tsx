import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { Color } from 'three';
import { useWaveAnimation } from '../systems/useWaveAnimation';
import { useBrickShadow, SHADOW_LAYER_COUNT } from '../systems/useBrickShadow';
import { useBrickHitGlow } from '../systems/useBrickHitGlow';

export interface BrickProps {
  x: number;
  z: number;
  size: readonly [number, number, number];
  color: string;
  phaseOffset: number;
}

/**
 * Single oscillating brick with player proximity shadow
 * and neon glow on contact.
 */
export function Brick({ x, z, size, color, phaseOffset }: BrickProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  useWaveAnimation(rigidBodyRef, x, z, phaseOffset);
  const shadowGroupRef = useBrickShadow(rigidBodyRef);
  const { hitColor, onCollisionEnter, onCollisionExit } = useBrickHitGlow();

  const isHit = hitColor !== null;
  const halfH = size[1] / 2 + 0.01;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      position={[x, 0, z]}
      colliders="cuboid"
      onCollisionEnter={onCollisionEnter}
      onCollisionExit={onCollisionExit}
    >
      <mesh receiveShadow>
        <boxGeometry args={[...size]} />
        <meshStandardMaterial
          color={isHit ? hitColor : color}
          emissive={isHit ? new Color(hitColor) : new Color(color).multiplyScalar(0.15)}
          emissiveIntensity={isHit ? 2.5 : 0.3}
          toneMapped={false}
        />
      </mesh>
      <group ref={shadowGroupRef} position={[0, halfH, 0]} visible={false}>
        {Array.from({ length: SHADOW_LAYER_COUNT }, (_, i) => (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[0, i * 0.001, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
}
