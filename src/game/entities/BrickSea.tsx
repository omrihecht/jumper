import { useMemo } from 'react';
import { Brick } from './Brick';
import { useGameStore } from '../state/gameStore';

interface BrickData {
  key: string;
  x: number;
  z: number;
  phaseOffset: number;
}

/**
 * Grid manager that spawns Brick instances.
 * Each Brick drives its own wave animation internally.
 */
export function BrickSea() {
  const level = useGameStore((s) => s.currentLevel);

  const bricks = useMemo<BrickData[]>(() => {
    const result: BrickData[] = [];
    const offsetX = ((level.gridCols - 1) * level.brickSpacing) / 2;
    const startZ = -(level.startGap + level.brickSpacing);

    for (let row = 0; row < level.gridRows; row++) {
      for (let col = 0; col < level.gridCols; col++) {
        result.push({
          key: `${col}-${row}`,
          x: col * level.brickSpacing - offsetX,
          z: startZ - row * level.brickSpacing,
          phaseOffset: (row + col) * level.wavePhaseScale,
        });
      }
    }
    return result;
  }, [level]);

  return (
    <>
      {bricks.map((b) => (
        <Brick
          key={b.key}
          x={b.x}
          z={b.z}
          size={level.brickSize}
          color={level.brickColor}
          phaseOffset={b.phaseOffset}
        />
      ))}
    </>
  );
}
