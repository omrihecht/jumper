import { useRapier } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useDevStore } from './devStore';

/**
 * Syncs the Rapier world gravity to the dev store value
 * each frame, allowing runtime gravity changes via the panel.
 */
export function useDevGravity() {
  const { world } = useRapier();

  useFrame(() => {
    const g = useDevStore.getState().physics.gravity;
    if (Math.abs(world.gravity.y - g) > 0.01) {
      world.gravity.y = g;
    }
  });
}
