import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { useGameStore } from '../state/gameStore';
import type { Group, Mesh } from 'three';
import type { MeshBasicMaterial } from 'three';

const SHADOW_MAX_HEIGHT = 10;
const DEFAULT_XZ_THRESHOLD = 1.2;
const SHADOW_BASE_SIZE = 0.6;
const SHADOW_BLUR_SCALE = 1.8;
export const SHADOW_LAYER_COUNT = 3;

/**
 * Manages a multi-layer shadow group projected onto a surface
 * based on the player's proximity above it.
 */
export function useBrickShadow(
  rigidBodyRef: React.RefObject<RapierRigidBody | null>,
  xzThreshold = DEFAULT_XZ_THRESHOLD,
) {
  const shadowGroupRef = useRef<Group>(null);

  useFrame(() => {
    const group = shadowGroupRef.current;
    const body = rigidBodyRef.current;
    if (!group || !body) return;

    const [px, py, pz] = useGameStore.getState().player.position;
    const brickPos = body.translation();

    const dx = Math.abs(px - brickPos.x);
    const dz = Math.abs(pz - brickPos.z);
    const dy = py - brickPos.y;

    const directlyBelow = dx < xzThreshold && dz < xzThreshold && dy > 0;
    const t = directlyBelow ? Math.max(0, 1 - dy / SHADOW_MAX_HEIGHT) : 0;
    group.visible = t > 0.01;

    if (group.visible) {
      group.position.x = px - brickPos.x;
      group.position.z = pz - brickPos.z;

      const scale = SHADOW_BASE_SIZE * (0.4 + 0.6 * t);
      const blur = (1 - t) * SHADOW_BLUR_SCALE;

      const children = group.children as Mesh[];
      const core = children[0];
      core.scale.set(scale, scale, 1);
      (core.material as MeshBasicMaterial).opacity = t * 0.8;

      for (let i = 1; i < children.length; i++) {
        const layerScale = scale + blur * (i * 0.4);
        children[i].scale.set(layerScale, layerScale, 1);
        (children[i].material as MeshBasicMaterial).opacity =
          t * 0.2 * (1 - i / children.length);
      }
    }
  });

  return shadowGroupRef;
}
