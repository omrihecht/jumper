import { useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { JUMP } from '../config/gameConfig';
import { KEY_BINDINGS } from '../config/controls';
import { useGameStore } from '../state/gameStore';
import { useDevStore } from '../dev/devStore';

const jumpKeyCodes = new Set(KEY_BINDINGS.jump);

export function useJumpPhysics(
  rigidBodyRef: RefObject<RapierRigidBody | null>
) {
  const timeSinceGrounded = useRef(0);
  const jumpBufferTimer = useRef(0);
  const jumpCooldownTimer = useRef(0);
  const jumpKeys = useRef(new Set<string>());

  useEffect(() => {
    const keys = jumpKeys.current;
    const onKeyDown = (e: KeyboardEvent) => {
      if (jumpKeyCodes.has(e.code)) {
        e.preventDefault();
        keys.add(e.code);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (jumpKeyCodes.has(e.code)) keys.delete(e.code);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      keys.clear();
    };
  }, []);

  useFrame((_, delta) => {
    const body = rigidBodyRef.current;
    if (!body) return;

    const { phase, player, setPlayerGrounded, setPlayerJumping } =
      useGameStore.getState();
    if (phase !== 'playing') return;

    const { force, cooldown } = useDevStore.getState().jump;

    const vel = body.linvel();
    const isOnGround = player.isGrounded;

    if (isOnGround) {
      timeSinceGrounded.current = 0;
    } else {
      timeSinceGrounded.current += delta;
    }

    jumpCooldownTimer.current = Math.max(0, jumpCooldownTimer.current - delta);
    jumpBufferTimer.current = Math.max(0, jumpBufferTimer.current - delta);

    if (jumpKeys.current.size > 0) {
      jumpBufferTimer.current = JUMP.bufferTime;
    }

    const canJump =
      jumpBufferTimer.current > 0 &&
      timeSinceGrounded.current < JUMP.coyoteTime &&
      jumpCooldownTimer.current <= 0;

    if (canJump) {
      body.setLinvel({ x: vel.x, y: force, z: vel.z }, true);
      jumpBufferTimer.current = 0;
      jumpCooldownTimer.current = cooldown;
      setPlayerJumping(true);
      setPlayerGrounded(false);
      timeSinceGrounded.current = JUMP.coyoteTime;
    }

    if (vel.y < -0.1 && player.isJumping) {
      setPlayerJumping(false);
    }
  });
}
