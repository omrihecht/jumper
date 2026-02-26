import { create } from 'zustand';
import { PHYSICS, MOVEMENT, JUMP, CAMERA } from '../config/gameConfig';

export interface DevPhysics {
  gravity: number;
  playerLinearDamping: number;
}

export interface DevMovement {
  speed: number;
  sprintMultiplier: number;
}

export interface DevJump {
  force: number;
  cooldown: number;
}

export interface DevCamera {
  fov: number;
  offsetY: number;
  offsetZ: number;
  lookAtZ: number;
  smoothSpeed: number;
}

interface DevState {
  physics: DevPhysics;
  movement: DevMovement;
  jump: DevJump;
  camera: DevCamera;
}

interface DevActions {
  setPhysics: (patch: Partial<DevPhysics>) => void;
  setMovement: (patch: Partial<DevMovement>) => void;
  setJump: (patch: Partial<DevJump>) => void;
  setCamera: (patch: Partial<DevCamera>) => void;
  resetAll: () => void;
}

export type DevStore = DevState & DevActions;

const defaults: DevState = {
  physics: {
    gravity: PHYSICS.gravity,
    playerLinearDamping: PHYSICS.playerLinearDamping,
  },
  movement: {
    speed: MOVEMENT.speed,
    sprintMultiplier: MOVEMENT.sprintMultiplier,
  },
  jump: {
    force: JUMP.force,
    cooldown: JUMP.cooldown,
  },
  camera: {
    fov: CAMERA.fov,
    offsetY: CAMERA.offset[1],
    offsetZ: CAMERA.offset[2],
    lookAtZ: CAMERA.lookAt[2],
    smoothSpeed: CAMERA.smoothSpeed,
  },
};

export const useDevStore = create<DevStore>((set) => ({
  ...defaults,

  setPhysics: (patch) =>
    set((s) => ({ physics: { ...s.physics, ...patch } })),

  setMovement: (patch) =>
    set((s) => ({ movement: { ...s.movement, ...patch } })),

  setJump: (patch) =>
    set((s) => ({ jump: { ...s.jump, ...patch } })),

  setCamera: (patch) =>
    set((s) => ({ camera: { ...s.camera, ...patch } })),

  resetAll: () => set(defaults),
}));
