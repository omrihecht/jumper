import type { LevelConfig } from '../config/levelConfig';

/** Possible game phases, forming a state machine. */
export type GamePhase = 'idle' | 'playing' | 'paused' | 'level_up';

/** Which screen is currently active (drives the 3D scene inside Canvas). */
export type Screen = 'menu' | 'play' | 'game-over' | 'you-win';

/** 3D vector as a mutable tuple. */
export type Vec3 = [x: number, y: number, z: number];

/** Player-specific runtime state. */
export interface PlayerState {
  position: Vec3;
  isGrounded: boolean;
  isJumping: boolean;
}

/** Aggregate game state stored in Zustand. */
export interface GameState {
  phase: GamePhase;
  currentScreen: Screen;
  score: number;
  lives: number;
  elapsedTime: number;
  levelIndex: number;
  currentLevel: LevelConfig;
  player: PlayerState;
  /** Increments on each player reset so systems can react. */
  resetCount: number;
}

/** Actions exposed by the game store. */
export interface GameActions {
  setScreen: (screen: Screen) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  winGame: () => void;
  advanceLevel: () => void;
  returnToMenu: () => void;
  setPlayerGrounded: (grounded: boolean) => void;
  setPlayerJumping: (jumping: boolean) => void;
  loseLife: () => void;
  tick: (delta: number) => void;
  resetPlayer: () => void;
}

export type GameStore = GameState & GameActions;
