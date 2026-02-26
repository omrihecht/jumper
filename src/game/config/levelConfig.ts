export interface LevelConfig {
  /** Unique level identifier */
  id: string;
  /** Display name */
  name: string;
  /** Number of brick columns (X axis) */
  gridCols: number;
  /** Number of brick rows (Z axis) */
  gridRows: number;
  /** Spacing between brick centers */
  brickSpacing: number;
  /** Brick dimensions [width, height, depth] */
  brickSize: readonly [number, number, number];
  /** Brick base color */
  brickColor: string;
  /** Vertical oscillation amplitude */
  waveAmplitude: number;
  /** Wave cycle speed (radians per second) */
  waveFrequency: number;
  /** Phase offset multiplier per grid position — higher = tighter wave */
  wavePhaseScale: number;
  /** Distance from start platform to first brick row */
  startGap: number;
  /** Distance from last brick row to end platform */
  endGap: number;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 'level-1',
    name: 'Calm Seas',
    gridCols: 5,
    gridRows: 8,
    brickSpacing: 2.5,
    brickSize: [1.8, 0.4, 1.8],
    brickColor: '#ff8c00',
    waveAmplitude: 1.2,
    waveFrequency: 1.5,
    wavePhaseScale: 0.6,
    startGap: 6,
    endGap: 6,
  },
  {
    id: 'level-2',
    name: 'Rising Tide',
    gridCols: 6,
    gridRows: 12,
    brickSpacing: 2.2,
    brickSize: [1.3, 0.4, 1.3],
    brickColor: '#ff7043',
    waveAmplitude: 2.0,
    waveFrequency: 2.0,
    wavePhaseScale: 0.8,
    startGap: 4,
    endGap: 4,
  },
  {
    id: 'level-3',
    name: 'Stormy Waters',
    gridCols: 7,
    gridRows: 36,
    brickSpacing: 2.5,
    brickSize: [1.1, 0.4, 1.1],
    brickColor: '#e53935',
    waveAmplitude: 3.0,
    waveFrequency: 2.5,
    wavePhaseScale: 1.0,
    startGap: 5,
    endGap: 5,
  },
];

export const DEFAULT_LEVEL = LEVELS[0];
