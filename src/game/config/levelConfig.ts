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
    gridCols: 4,
    gridRows: 4,
    brickSpacing: 2.5,
    brickSize: [1.8, 1, 1.8],
    brickColor: '#ff8c00',
    waveAmplitude: 1.2,
    waveFrequency: 1.5,
    wavePhaseScale: 0.6,
    startGap: 3,
    endGap: 6,
  },
  {
    id: 'level-2',
    name: 'Rising Tide',
    gridCols: 5,
    gridRows: 8,
    brickSpacing: 2.3,
    brickSize: [1.5, 0.6, 1.5],
    brickColor: '#ff7043',
    waveAmplitude: 1.6,
    waveFrequency: 1.8,
    wavePhaseScale: 0.7,
    startGap: 3,
    endGap: 4,
  },
  {
    id: 'level-3',
    name: 'Stormy Waters',
    gridCols: 6,
    gridRows: 16,
    brickSpacing: 2.4,
    brickSize: [1.3, 0.5, 1.3],
    brickColor: '#e53935',
    waveAmplitude: 2.2,
    waveFrequency: 2.0,
    wavePhaseScale: 0.85,
    startGap: 3,
    endGap: 5,
  },
];

export const DEFAULT_LEVEL = LEVELS[0];
