import { useLayoutEffect } from 'react';
import { useGameStore } from './gameStore';
import type { Screen } from './types';

/**
 * Synchronises the Zustand `currentScreen` with the mounted route.
 * Runs in useLayoutEffect so the correct 3D scene renders before paint,
 * preventing a single-frame flash of the wrong scene on page refresh.
 */
export function useScreenSync(screen: Screen) {
  useLayoutEffect(() => {
    if (useGameStore.getState().currentScreen !== screen) {
      useGameStore.getState().setScreen(screen);
    }
  }, [screen]);
}
