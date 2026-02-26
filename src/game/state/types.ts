import type { LevelConfig } from '../config/levelConfig';

/** Possible game phases, forming a state machine. */
export type GamePhase = 'menu' | 'playing' | 'paused' | 'won' | 'lost';

/** 3D vector as a mutable tuple. */
export type Vec3 = [x: number, y: number, z: number];

/** Player-specific runtime state. */
export interface PlayerState {
  position: Vec3;
  velocity: Vec3;
  isGrounded: boolean;
  isJumping: boolean;
}

/** Aggregate game state stored in Zustand. */
export interface GameState {
  phase: GamePhase;
  score: number;
  lives: number;
  elapsedTime: number;
  currentLevel: LevelConfig;
  player: PlayerState;
}

/** Actions exposed by the game store. */
export interface GameActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  winGame: () => void;
  loseGame: () => void;
  returnToMenu: () => void;
  setPlayerPosition: (pos: Vec3) => void;
  setPlayerVelocity: (vel: Vec3) => void;
  setPlayerGrounded: (grounded: boolean) => void;
  setPlayerJumping: (jumping: boolean) => void;
  addScore: (points: number) => void;
  loseLife: () => void;
  tick: (delta: number) => void;
  resetPlayer: () => void;
}

export type GameStore = GameState & GameActions;
