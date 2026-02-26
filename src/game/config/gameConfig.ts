export const PHYSICS = {
  gravity: -100,
  playerMass: 1,
  playerLinearDamping: 0,
  playerAngularDamping: 0.5,
} as const;

export const MOVEMENT = {
  speed: 8.5,
  sprintMultiplier: 1.4,
  turnSpeed: 5,
  airControlFactor: 0.3,
} as const;

export const JUMP = {
  force: 33,
  maxHeight: 4,
  coyoteTime: 0.15,
  bufferTime: 0.1,
  cooldown: 0.10,
} as const;

export const CAMERA = {
  offset: [-0.4, 8, 12.8] as readonly [number, number, number],
  lookAt: [0, 0, -25] as readonly [number, number, number],
  lookAheadDistance: 2,
  smoothSpeed: 5,
  fov: 60,
  near: 0.1,
  far: 1000,
} as const;

export const PLAYER = {
  size: [0.6, 1, 0.6] as readonly [number, number, number],
  color: '#00e5ff',
  startPosition: [0, 2, 0] as readonly [number, number, number],
} as const;

export const PLATFORM = {
  startSize: [4, 0.5, 4] as readonly [number, number, number],
  endSize: [4, 0.5, 4] as readonly [number, number, number],
  startColor: '#39ff14',
  endColor: '#ff355e',
} as const;
