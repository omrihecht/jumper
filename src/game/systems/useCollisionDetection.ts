import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DEATH_PLANE_Y } from '../config/gameConfig';
import { useGameStore } from '../state/gameStore';

/**
 * Checks each frame whether the player has fallen
 * below the death plane, triggering a life loss or game over.
 * Uses a flag to prevent multiple triggers during the same fall.
 */
export function useCollisionDetection() {
  const hasFallen = useRef(false);

  useFrame(() => {
    const { phase, player, loseLife, resetPlayer } = useGameStore.getState();
    if (phase !== 'playing') return;

    if (player.position[1] < DEATH_PLANE_Y) {
      if (!hasFallen.current) {
        hasFallen.current = true;
        loseLife();
        resetPlayer();
      }
    } else {
      hasFallen.current = false;
    }
  });
}
