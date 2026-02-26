import { create } from 'zustand';
import { PLAYER } from '../config/gameConfig';
import { DEFAULT_LEVEL } from '../config/levelConfig';
import type { GameState, GameStore, PlayerState, Vec3 } from './types';

const initialPlayer: PlayerState = {
  position: [...PLAYER.startPosition] as Vec3,
  velocity: [0, 0, 0],
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
    set((s) => (s.phase === 'playing' ? { phase: 'won' } : s)),

  loseGame: () =>
    set((s) => (s.phase === 'playing' ? { phase: 'lost' } : s)),

  returnToMenu: () => set({ ...initialState, player: { ...initialPlayer } }),

  setPlayerPosition: (position) =>
    set((s) => ({ player: { ...s.player, position } })),

  setPlayerVelocity: (velocity) =>
    set((s) => ({ player: { ...s.player, velocity } })),

  setPlayerGrounded: (isGrounded) =>
    set((s) => ({ player: { ...s.player, isGrounded } })),

  setPlayerJumping: (isJumping) =>
    set((s) => ({ player: { ...s.player, isJumping } })),

  addScore: (points) => set((s) => ({ score: s.score + points })),

  loseLife: () =>
    set((s) => {
      const lives = s.lives - 1;
      if (lives <= 0) return { lives: 0, phase: 'lost' };
      return { lives };
    }),

  tick: (delta) =>
    set((s) =>
      s.phase === 'playing'
        ? { elapsedTime: s.elapsedTime + delta }
        : s
    ),

  resetPlayer: () =>
    set({
      player: { ...initialPlayer, position: [...PLAYER.startPosition] as Vec3 },
    }),
}));
