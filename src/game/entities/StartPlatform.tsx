import { useRef, useMemo } from 'react';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { CylinderGeometry, EdgesGeometry, Color } from 'three';
import { PLATFORM, PLATFORM_XZ_THRESHOLD } from '../config/gameConfig';
import { PLATFORM_EDGE_MAT } from './platformMaterials';
import { useBrickShadow } from '../systems/useBrickShadow';
import { ShadowGroup } from './ShadowGroup';

const EMISSIVE = new Color(PLATFORM.startColor);
const RADIUS = PLATFORM.startSize[0] / 2;
const HEIGHT = PLATFORM.startSize[1];
const SEGMENTS = 48;

/**
 * Fixed starting platform where the player spawns.
 */
export function StartPlatform() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const shadowGroupRef = useBrickShadow(rigidBodyRef, PLATFORM_XZ_THRESHOLD);

  const edgesGeo = useMemo(() => {
    const cyl = new CylinderGeometry(RADIUS, RADIUS, HEIGHT, SEGMENTS);
    const edges = new EdgesGeometry(cyl, 15);
    cyl.dispose();
    return edges;
  }, []);

  const halfH = HEIGHT / 2 + 0.01;

  return (
    <RigidBody ref={rigidBodyRef} type="fixed" position={[0, 0, 0]} colliders={false}>
      <CylinderCollider args={[HEIGHT / 2, RADIUS]} />
      <mesh receiveShadow>
        <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, SEGMENTS]} />
        <meshPhysicalMaterial
          color={PLATFORM.startColor}
          transparent
          opacity={0.35}
          roughness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.05}
          emissive={EMISSIVE}
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
      <lineSegments geometry={edgesGeo} material={PLATFORM_EDGE_MAT} />
      <ShadowGroup ref={shadowGroupRef} yOffset={halfH} />
    </RigidBody>
  );
}
