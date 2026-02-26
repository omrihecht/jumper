import type { RefObject } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useDevStore } from './devStore';

/**
 * Syncs the player rigid body's linear damping to the dev store value
 * each frame, allowing runtime tuning via the panel.
 */
export function useDevDamping(
  rigidBodyRef: RefObject<RapierRigidBody | null>,
) {
  useFrame(() => {
    const body = rigidBodyRef.current;
    if (!body) return;

    const damping = useDevStore.getState().physics.playerLinearDamping;
    body.setLinearDamping(damping);
  });
}
