import { useRef, useMemo, useCallback } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { BoxGeometry, EdgesGeometry, LineBasicMaterial, Color } from 'three';
import { PLATFORM } from '../config/gameConfig';
import { useGameStore } from '../state/gameStore';
import { useBrickShadow } from '../systems/useBrickShadow';
import { ShadowGroup } from './ShadowGroup';

const EDGE_MAT = new LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 });
const PLATFORM_XZ_THRESHOLD = 2.5;
const EMISSIVE = new Color(PLATFORM.endColor);

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
    const box = new BoxGeometry(...PLATFORM.endSize);
    const edges = new EdgesGeometry(box);
    box.dispose();
    return edges;
  }, []);

  const onCollisionEnter = useCallback(() => {
    const { phase, winGame } = useGameStore.getState();
    if (phase === 'playing') winGame();
  }, []);

  const halfH = PLATFORM.endSize[1] / 2 + 0.01;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="fixed"
      position={[0, 0, z]}
      colliders="cuboid"
      onCollisionEnter={onCollisionEnter}
    >
      <mesh receiveShadow>
        <boxGeometry args={[...PLATFORM.endSize]} />
        <meshPhysicalMaterial
          color={PLATFORM.endColor}
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
      <lineSegments geometry={edgesGeo} material={EDGE_MAT} />
      <ShadowGroup ref={shadowGroupRef} yOffset={halfH} />
    </RigidBody>
  );
}
