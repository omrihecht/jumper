import { useRef } from 'react';
import type { RefObject } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { JUMP } from '../config/gameConfig';
import { useGameStore } from '../state/gameStore';
import { useDevStore } from '../dev/devStore';

export function useJumpPhysics(
  rigidBodyRef: RefObject<RapierRigidBody | null>
) {
  const timeSinceGrounded = useRef(0);
  const jumpBufferTimer = useRef(0);
  const jumpCooldownTimer = useRef(0);

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

    const jumpPressed = isJumpKeyDown();
    if (jumpPressed) {
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

const _jumpKeys = new Set<string>();

function isJumpKeyDown() {
  return _jumpKeys.size > 0;
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      _jumpKeys.add(e.code);
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') _jumpKeys.delete(e.code);
  });
}
