import { useRef, useMemo, useCallback } from 'react';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { CylinderGeometry, EdgesGeometry, Color } from 'three';
import { PLATFORM, PLATFORM_XZ_THRESHOLD } from '../config/gameConfig';
import { PLATFORM_EDGE_MAT } from './platformMaterials';
import { useGameStore } from '../state/gameStore';
import { navigateTo } from '../navigation';
import { useBrickShadow } from '../systems/useBrickShadow';
import { ShadowGroup } from './ShadowGroup';

const EMISSIVE = new Color(PLATFORM.endColor);
const RADIUS = PLATFORM.endSize[0] / 2;
const HEIGHT = PLATFORM.endSize[1];
const SEGMENTS = 48;

/**
 * Goal platform at the far end of the brick sea.
 * Triggers the win condition when the player lands on it.
 */
export function EndPlatform() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const level = useGameStore((s) => s.currentLevel);
  const z = -(level.startGap + level.gridRows * level.brickSpacing + level.endGap);

  const shadowGroupRef = useBrickShadow(rigidBodyRef, PLATFORM_XZ_THRESHOLD);

  const edgesGeo = useMemo(() => {
    const cyl = new CylinderGeometry(RADIUS, RADIUS, HEIGHT, SEGMENTS);
    const edges = new EdgesGeometry(cyl, 15);
    cyl.dispose();
    return edges;
  }, []);

  const onCollisionEnter = useCallback(() => {
    const { phase, winGame } = useGameStore.getState();
    if (phase !== 'playing') return;
    winGame();
    if (useGameStore.getState().phase === 'idle') {
      navigateTo('/you-win');
    }
  }, []);

  const halfH = HEIGHT / 2 + 0.01;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="fixed"
      position={[0, 0, z]}
      colliders={false}
      onCollisionEnter={onCollisionEnter}
    >
      <CylinderCollider args={[HEIGHT / 2, RADIUS]} />
      <mesh receiveShadow>
        <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, SEGMENTS]} />
        <meshPhysicalMaterial
          color={PLATFORM.endColor}
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
