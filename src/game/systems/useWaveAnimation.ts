import type { RefObject } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../state/gameStore';

/**
 * Drives sine-wave vertical oscillation for a single brick.
 * Called by each Brick instance so it can update its own
 * kinematic rigid body position every frame.
 *
 * Y = amplitude * sin(frequency * time + phaseOffset)
 */
export function useWaveAnimation(
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  baseX: number,
  baseZ: number,
  phaseOffset: number
) {
  useFrame(({ clock }) => {
    const body = rigidBodyRef.current;
    if (!body) return;

    const level = useGameStore.getState().currentLevel;
    const t = clock.getElapsedTime();
    const y = level.waveAmplitude * Math.sin(level.waveFrequency * t + phaseOffset);

    body.setNextKinematicTranslation({ x: baseX, y, z: baseZ });
  });
}
