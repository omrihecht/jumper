import { useRef, useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { BoxGeometry, EdgesGeometry, Color } from 'three';
import { PLATFORM, PLATFORM_XZ_THRESHOLD } from '../config/gameConfig';
import { PLATFORM_EDGE_MAT } from './platformMaterials';
import { useBrickShadow } from '../systems/useBrickShadow';
import { ShadowGroup } from './ShadowGroup';

const EMISSIVE = new Color(PLATFORM.startColor);

/**
 * Fixed starting platform where the player spawns.
 */
export function StartPlatform() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const shadowGroupRef = useBrickShadow(rigidBodyRef, PLATFORM_XZ_THRESHOLD);

  const edgesGeo = useMemo(() => {
    const box = new BoxGeometry(...PLATFORM.startSize);
    const edges = new EdgesGeometry(box);
    box.dispose();
    return edges;
  }, []);

  const halfH = PLATFORM.startSize[1] / 2 + 0.01;

  return (
    <RigidBody ref={rigidBodyRef} type="fixed" position={[0, 0, 0]} colliders="cuboid">
      <mesh receiveShadow>
        <boxGeometry args={[...PLATFORM.startSize]} />
        <meshPhysicalMaterial
          color={PLATFORM.startColor}
          transparent
          opacity={0.2}
          roughness={0.2}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
          emissive={EMISSIVE}
          emissiveIntensity={0.3}
          toneMapped={false}
        />
      </mesh>
      <lineSegments geometry={edgesGeo} material={PLATFORM_EDGE_MAT} />
      <ShadowGroup ref={shadowGroupRef} yOffset={halfH} />
    </RigidBody>
  );
}
