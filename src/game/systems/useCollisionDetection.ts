import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../state/gameStore';

const DEATH_PLANE_Y = -20;

/**
 * Checks each frame whether the player has fallen
 * below the death plane, triggering a life loss or game over.
 */
export function useCollisionDetection() {
  useFrame(() => {
    const { phase, player, loseLife, resetPlayer } = useGameStore.getState();
    if (phase !== 'playing') return;

    if (player.position[1] < DEATH_PLANE_Y) {
      loseLife();
      resetPlayer();
    }
  });
}
