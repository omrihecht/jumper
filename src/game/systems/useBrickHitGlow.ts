import { useRef, useCallback } from 'react';
import type { MutableRefObject } from 'react';

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
 * Tracks collision contact state and stores the current hit color
 * in a ref (no React state / no re-renders).
 * The actual material update is handled imperatively by useBrickLifecycle.
 */
export function useBrickHitGlow(): {
  hitColorRef: MutableRefObject<string | null>;
  onCollisionEnter: () => void;
  onCollisionExit: () => void;
} {
  const hitColorRef = useRef<string | null>(null);
  const contactCount = useRef(0);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCollisionEnter = useCallback(() => {
    contactCount.current++;
    if (exitTimer.current) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    if (hitColorRef.current === null) {
      hitColorRef.current = randomHitColor();
    }
  }, []);

  const onCollisionExit = useCallback(() => {
    contactCount.current = Math.max(0, contactCount.current - 1);
    if (contactCount.current === 0) {
      exitTimer.current = setTimeout(() => {
        if (contactCount.current === 0) {
          hitColorRef.current = null;
        }
        exitTimer.current = null;
      }, DEBOUNCE_MS);
    }
  }, []);

  return { hitColorRef, onCollisionEnter, onCollisionExit };
}
