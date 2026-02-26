import { create } from 'zustand';
import { PLAYER } from '../config/gameConfig';
import { DEFAULT_LEVEL } from '../config/levelConfig';
import type { GameState, GameStore, PlayerState, Vec3 } from './types';

const initialPlayer: PlayerState = {
  position: [...PLAYER.startPosition] as Vec3,
  isGrounded: false,
  isJumping: false,
};

const initialState: GameState = {
  phase: 'menu',
  score: 0,
  lives: 3,
  elapsedTime: 0,
  currentLevel: DEFAULT_LEVEL,
  player: { ...initialPlayer },
  resetCount: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  startGame: () =>
    set({
      phase: 'playing',
      score: 0,
      lives: 3,
      elapsedTime: 0,
      player: { ...initialPlayer, position: [...PLAYER.startPosition] as Vec3 },
    }),

  pauseGame: () =>
    set((s) => (s.phase === 'playing' ? { phase: 'paused' } : s)),

  resumeGame: () =>
    set((s) => (s.phase === 'paused' ? { phase: 'playing' } : s)),

  winGame: () =>
    set((s) =>
      s.phase === 'playing'
        ? { phase: 'won', lives: s.lives + 1 }
        : s
    ),

  loseGame: () =>
    set((s) => (s.phase === 'playing' ? { phase: 'lost' } : s)),

  returnToMenu: () => set({ ...initialState, player: { ...initialPlayer } }),

  setPlayerGrounded: (isGrounded) => {
    if (useGameStore.getState().player.isGrounded === isGrounded) return;
    set((s) => ({ player: { ...s.player, isGrounded } }));
  },

  setPlayerJumping: (isJumping) => {
    if (useGameStore.getState().player.isJumping === isJumping) return;
    set((s) => ({ player: { ...s.player, isJumping } }));
  },

  addScore: (points) => set((s) => ({ score: s.score + points })),

  loseLife: () =>
    set((s) => {
      if (s.lives <= 0) return { phase: 'lost' };
      return { lives: s.lives - 1 };
    }),

  tick: (delta) => {
    const s = useGameStore.getState();
    if (s.phase !== 'playing') return;
    const next = s.elapsedTime + delta;
    if (Math.floor(next * 10) !== Math.floor(s.elapsedTime * 10)) {
      set({ elapsedTime: next });
    } else {
      s.elapsedTime = next;
    }
  },

  resetPlayer: () =>
    set((s) => ({
      player: { ...initialPlayer, position: [...PLAYER.startPosition] as Vec3 },
      resetCount: s.resetCount + 1,
    })),
}));
