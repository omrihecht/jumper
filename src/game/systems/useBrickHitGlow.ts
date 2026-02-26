import { useRef, useState, useCallback } from 'react';
import type { CollisionEnterPayload } from '@react-three/rapier';

const HIT_COLORS = [
  '#ff00ff', '#00ffff', '#39ff14', '#ffff00',
  '#ff3131', '#00bfff', '#ff6ec7', '#bf00ff',
  '#00fff7', '#7fff00', '#ff9500', '#ff355e',
];

const DEBOUNCE_MS = 100;

function randomHitColor() {
  return HIT_COLORS[Math.floor(Math.random() * HIT_COLORS.length)];
}

/**
 * Manages the neon hit-glow effect when the player lands on a brick.
 * Returns the current hit color and collision handlers.
 */
export function useBrickHitGlow() {
  const [hitColor, setHitColor] = useState<string | null>(null);
  const contactCount = useRef(0);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCollisionEnter = useCallback((_payload: CollisionEnterPayload) => {
    contactCount.current++;
    if (exitTimer.current) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    setHitColor((prev) => prev ?? randomHitColor());
  }, []);

  const onCollisionExit = useCallback(() => {
    contactCount.current = Math.max(0, contactCount.current - 1);
    if (contactCount.current === 0) {
      exitTimer.current = setTimeout(() => {
        if (contactCount.current === 0) {
          setHitColor(null);
        }
        exitTimer.current = null;
      }, DEBOUNCE_MS);
    }
  }, []);

  return { hitColor, onCollisionEnter, onCollisionExit };
}
