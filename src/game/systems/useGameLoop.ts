import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../state/gameStore';
import { useCollisionDetection } from './useCollisionDetection';

/**
 * Master game loop that coordinates per-frame system updates.
 * Called once in GameScene to drive the tick and orchestrate
 * system execution order.
 */
export function useGameLoop() {
  useCollisionDetection();

  useFrame((_, delta) => {
    const { phase, tick } = useGameStore.getState();
    if (phase !== 'playing') return;

    tick(delta);

    // TODO: Add any cross-system coordination logic here
  });
}
