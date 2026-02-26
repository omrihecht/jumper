import { useRef, useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { EdgesGeometry, BoxGeometry, LineBasicMaterial } from 'three';
import type { Group } from 'three';
import { useWaveAnimation } from '../systems/useWaveAnimation';
import { useBrickShadow } from '../systems/useBrickShadow';
import { useBrickHitGlow } from '../systems/useBrickHitGlow';
import { useBrickLifecycle } from '../systems/useBrickLifecycle';
import { ShadowGroup } from './ShadowGroup';

export interface BrickProps {
  x: number;
  z: number;
  size: readonly [number, number, number];
  phaseOffset: number;
}

/**
 * Single oscillating brick. All dynamic material properties
 * (color, emissive, opacity) are managed imperatively by
 * useBrickLifecycle — this component never re-renders on collision.
 */
export function Brick({ x, z, size, phaseOffset }: BrickProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshGroupRef = useRef<Group>(null);

  useWaveAnimation(rigidBodyRef, x, z, phaseOffset);
  const { hitColorRef, onCollisionEnter, onCollisionExit } = useBrickHitGlow();
  useBrickLifecycle(rigidBodyRef, meshGroupRef, hitColorRef, phaseOffset, size[1]);
  const shadowGroupRef = useBrickShadow(rigidBodyRef);

  const { edgesGeo, edgeMat } = useMemo(() => {
    const box = new BoxGeometry(...size);
    const edges = new EdgesGeometry(box);
    box.dispose();
    const mat = new LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.4 });
    return { edgesGeo: edges, edgeMat: mat };
  }, [size]);

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
      <group ref={meshGroupRef}>
        <mesh receiveShadow>
          <boxGeometry args={[...size]} />
          <meshPhysicalMaterial
            transparent
            roughness={0.15}
            metalness={0.05}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
            toneMapped={false}
          />
        </mesh>
        <lineSegments geometry={edgesGeo} material={edgeMat} />
        <ShadowGroup ref={shadowGroupRef} yOffset={halfH} />
      </group>
    </RigidBody>
  );
}
