import { useRef } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { PLAYER } from '../config/gameConfig';
import { useGameStore } from '../state/gameStore';

/**
 * Watches resetCount and teleports the rigid body back to
 * the start position when it increments (after losing a life).
 */
export function usePlayerReset(
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  groundContactCount: MutableRefObject<number>,
) {
  const lastResetCount = useRef(0);

  useFrame(() => {
    const body = rigidBodyRef.current;
    if (!body) return;

    const { resetCount } = useGameStore.getState();
    if (resetCount !== lastResetCount.current) {
      lastResetCount.current = resetCount;
      const [sx, sy, sz] = PLAYER.startPosition;
      body.setTranslation({ x: sx, y: sy, z: sz }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      groundContactCount.current = 0;
    }
  });
}
