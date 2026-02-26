import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { KEY_TO_ACTION } from '../config/controls';
import { useGameStore } from '../state/gameStore';
import { useDevStore } from '../dev/devStore';
import type { GameAction } from '../config/controls';

export function usePlayerController(
  rigidBodyRef: RefObject<RapierRigidBody | null>
) {
  const activeActions = useRef(new Set<GameAction>());

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const action = KEY_TO_ACTION.get(e.code);
      if (action) activeActions.current.add(action);
      if (action === 'pause') {
        const { phase, pauseGame, resumeGame } = useGameStore.getState();
        if (phase === 'playing') pauseGame();
        else if (phase === 'paused') resumeGame();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const action = KEY_TO_ACTION.get(e.code);
      if (action) activeActions.current.delete(action);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame(() => {
    const body = rigidBodyRef.current;
    if (!body) return;

    const { phase } = useGameStore.getState();
    if (phase !== 'playing') return;

    const { speed, sprintMultiplier } = useDevStore.getState().movement;

    const actions = activeActions.current;
    let moveX = 0;
    let moveZ = 0;

    if (actions.has('moveForward')) moveZ -= 1;
    if (actions.has('moveBackward')) moveZ += 1;
    if (actions.has('moveLeft')) moveX -= 1;
    if (actions.has('moveRight')) moveX += 1;

    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (length > 0) {
      moveX /= length;
      moveZ /= length;
    }

    const sprint = actions.has('sprint') ? sprintMultiplier : 1;
    const finalSpeed = speed * sprint;

    const currentVel = body.linvel();
    body.setLinvel(
      { x: moveX * finalSpeed, y: currentVel.y, z: moveZ * finalSpeed },
      true
    );

    const pos = body.translation();
    const p = useGameStore.getState().player.position;
    p[0] = pos.x;
    p[1] = pos.y;
    p[2] = pos.z;
  });
}
