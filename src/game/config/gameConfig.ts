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
  fov: 60,
  near: 0.1,
  far: 1000,
  minDistance: 5,
  maxDistance: 150,
  maxPolarAngle: Math.PI / 2.1,
  dampingFactor: 0.1,
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

export const LIGHTING = {
  ambientIntensity: 0.3,
  directionalIntensity: 0.8,
  directionalPosition: [10, 20, 10] as readonly [number, number, number],
  shadowMapSize: 2048,
  shadowCameraExtent: 20,
  shadowCameraFar: 50,
} as const;

export const ENVIRONMENT = {
  backgroundColor: '#1a1a1a',
} as const;

export const BRICK_LIFECYCLE = {
  visibleDuration: 8,
  vanishDuration: 1.5,
  disableThreshold: 0.08,
  fadeThreshold: 0.3,
} as const;

export const DEATH_PLANE_Y = -20;

export const PLATFORM_XZ_THRESHOLD = 2.5;
