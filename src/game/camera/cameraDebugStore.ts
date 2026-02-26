import { create } from 'zustand';

interface CameraDebugState {
  position: [number, number, number];
  target: [number, number, number];
  setPosition: (p: [number, number, number]) => void;
  setTarget: (t: [number, number, number]) => void;
}

export const useCameraDebugStore = create<CameraDebugState>((set) => ({
  position: [0, 0, 0],
  target: [0, 0, 0],
  setPosition: (position) => set({ position }),
  setTarget: (target) => set({ target }),
}));
