import { create } from 'zustand';
import { PLAYER } from '../config/gameConfig';
import { DEFAULT_LEVEL, LEVELS } from '../config/levelConfig';
import type { GameState, GameStore, PlayerState, Vec3 } from './types';

const initialPlayer: PlayerState = {
  position: [...PLAYER.startPosition] as Vec3,
  isGrounded: false,
  isJumping: false,
};

const initialState: GameState = {
  phase: 'idle',
  currentScreen: 'menu',
  score: 0,
  lives: 3,
  elapsedTime: 0,
  levelIndex: 0,
  currentLevel: DEFAULT_LEVEL,
  player: { ...initialPlayer },
  resetCount: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setScreen: (currentScreen) => set({ currentScreen }),

  startGame: () =>
    set({
      phase: 'playing',
      currentScreen: 'play',
      score: 0,
      lives: 3,
      elapsedTime: 0,
      levelIndex: 0,
      currentLevel: LEVELS[0],
      player: { ...initialPlayer, position: [...PLAYER.startPosition] as Vec3 },
    }),

  pauseGame: () =>
    set((s) => (s.phase === 'playing' ? { phase: 'paused' } : s)),

  resumeGame: () =>
    set((s) => (s.phase === 'paused' ? { phase: 'playing' } : s)),

  winGame: () =>
    set((s) => {
      if (s.phase !== 'playing') return s;
      const isLastLevel = s.levelIndex >= LEVELS.length - 1;
      return isLastLevel
        ? { phase: 'idle', currentScreen: 'you-win', lives: s.lives + 1 }
        : { phase: 'level_up', lives: s.lives + 1 };
    }),

  advanceLevel: () =>
    set((s) => {
      if (s.phase !== 'level_up') return s;
      const nextIndex = s.levelIndex + 1;
      return {
        phase: 'playing',
        levelIndex: nextIndex,
        currentLevel: LEVELS[nextIndex],
        player: { ...initialPlayer, position: [...PLAYER.startPosition] as Vec3 },
        resetCount: s.resetCount + 1,
      };
    }),

  returnToMenu: () =>
    set({ ...initialState, player: { ...initialPlayer } }),

  setPlayerGrounded: (isGrounded) => {
    if (useGameStore.getState().player.isGrounded === isGrounded) return;
    set((s) => ({ player: { ...s.player, isGrounded } }));
  },

  setPlayerJumping: (isJumping) => {
    if (useGameStore.getState().player.isJumping === isJumping) return;
    set((s) => ({ player: { ...s.player, isJumping } }));
  },

  loseLife: () =>
    set((s) => {
      if (s.lives <= 0) return { phase: 'idle', currentScreen: 'game-over' };
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
