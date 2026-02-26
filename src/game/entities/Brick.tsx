import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { Color, EdgesGeometry, BoxGeometry, LineBasicMaterial } from 'three';
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

const BASE_COLOR = '#8a8a8a';
const BASE_OPACITY = 0.35;
const HIT_OPACITY = 0.55;
const EDGE_COLOR = new LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.4 });

/**
 * Single oscillating brick with translucent plastic look,
 * white wireframe edges, player shadow, and color glow on contact.
 */
export function Brick({ x, z, size, phaseOffset }: BrickProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  useWaveAnimation(rigidBodyRef, x, z, phaseOffset);
  const shadowGroupRef = useBrickShadow(rigidBodyRef);
  const { hitColor, onCollisionEnter, onCollisionExit } = useBrickHitGlow();

  const isHit = hitColor !== null;
  const halfH = size[1] / 2 + 0.01;

  const boxGeo = new BoxGeometry(...size);
  const edgesGeo = new EdgesGeometry(boxGeo);

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
        <meshPhysicalMaterial
          color={isHit ? hitColor : BASE_COLOR}
          transparent
          opacity={isHit ? HIT_OPACITY : BASE_OPACITY}
          roughness={0.15}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          emissive={isHit ? new Color(hitColor) : new Color(BASE_COLOR).multiplyScalar(0.05)}
          emissiveIntensity={isHit ? 1.5 : 0.1}
          toneMapped={false}
        />
      </mesh>
      <lineSegments geometry={edgesGeo} material={EDGE_COLOR} />
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
