import { useEffect } from 'react';
import { useGameStore } from '../state/gameStore';
import s from './ui.module.scss';

const LEVEL_UP_DURATION_MS = 2000;

export function LevelUpOverlay() {
  const advanceLevel = useGameStore((s) => s.advanceLevel);
  const levelIndex = useGameStore((s) => s.levelIndex);

  useEffect(() => {
    const timer = setTimeout(advanceLevel, LEVEL_UP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [advanceLevel]);

  return (
    <div className={s.levelUp}>
      <h1>Level Up!</h1>
      <p>Get ready for Level {levelIndex + 2}</p>
    </div>
  );
}
