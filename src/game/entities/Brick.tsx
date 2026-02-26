import { useRef, useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { Color, EdgesGeometry, BoxGeometry, LineBasicMaterial } from 'three';
import { useWaveAnimation } from '../systems/useWaveAnimation';
import { useBrickShadow } from '../systems/useBrickShadow';
import { useBrickHitGlow } from '../systems/useBrickHitGlow';
import { ShadowGroup } from './ShadowGroup';

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
const EDGE_MAT = new LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.4 });
const BASE_EMISSIVE = new Color(BASE_COLOR).multiplyScalar(0.05);

/**
 * Single oscillating brick with translucent plastic look,
 * white wireframe edges, player shadow, and color glow on contact.
 */
export function Brick({ x, z, size, phaseOffset }: BrickProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  useWaveAnimation(rigidBodyRef, x, z, phaseOffset);
  const shadowGroupRef = useBrickShadow(rigidBodyRef);
  const { hitColor, onCollisionEnter, onCollisionExit } = useBrickHitGlow();

  const edgesGeo = useMemo(() => {
    const box = new BoxGeometry(...size);
    const edges = new EdgesGeometry(box);
    box.dispose();
    return edges;
  }, [size]);

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
        <meshPhysicalMaterial
          color={isHit ? hitColor : BASE_COLOR}
          transparent
          opacity={isHit ? HIT_OPACITY : BASE_OPACITY}
          roughness={0.15}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          emissive={isHit ? hitColor : BASE_EMISSIVE}
          emissiveIntensity={isHit ? 1.5 : 0.1}
          toneMapped={false}
        />
      </mesh>
      <lineSegments geometry={edgesGeo} material={EDGE_MAT} />
      <ShadowGroup ref={shadowGroupRef} yOffset={halfH} />
    </RigidBody>
  );
}
