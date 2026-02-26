export type GameAction =
  | 'moveForward'
  | 'moveBackward'
  | 'moveLeft'
  | 'moveRight'
  | 'jump'
  | 'sprint'
  | 'pause';

/**
 * Maps keyboard keys to game actions.
 * Multiple keys can trigger the same action.
 */
export const KEY_BINDINGS: Record<GameAction, string[]> = {
  moveForward: ['KeyW', 'ArrowUp'],
  moveBackward: ['KeyS', 'ArrowDown'],
  moveLeft: ['KeyA', 'ArrowLeft'],
  moveRight: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
  sprint: ['ShiftLeft', 'ShiftRight'],
  pause: ['Escape'],
};

/**
 * Reverse lookup: keyboard code -> action.
 * Built from KEY_BINDINGS so there's a single source of truth.
 */
export const KEY_TO_ACTION: ReadonlyMap<string, GameAction> = new Map(
  Object.entries(KEY_BINDINGS).flatMap(([action, keys]) =>
    keys.map((key) => [key, action as GameAction] as const)
  )
);
