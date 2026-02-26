import { useEffect } from 'react';
import { useGameStore } from '../state/gameStore';
import { overlayStyle, headingStyle } from './styles';

const LEVEL_UP_DURATION_MS = 2000;

const levelUpOverlayStyle: React.CSSProperties = {
  ...overlayStyle,
  background: 'rgba(0,0,0,0.55)',
  gap: 12,
};

const levelUpHeadingStyle: React.CSSProperties = {
  ...headingStyle,
  fontSize: 64,
  textShadow: '0 0 30px rgba(79,195,247,0.8)',
};

const subTextStyle: React.CSSProperties = {
  fontSize: 22,
  opacity: 0.7,
};

export function LevelUpOverlay() {
  const advanceLevel = useGameStore((s) => s.advanceLevel);
  const levelIndex = useGameStore((s) => s.levelIndex);

  useEffect(() => {
    const timer = setTimeout(advanceLevel, LEVEL_UP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [advanceLevel]);

  return (
    <div style={levelUpOverlayStyle}>
      <h1 style={levelUpHeadingStyle}>Level Up!</h1>
      <p style={subTextStyle}>Get ready for Level {levelIndex + 2}</p>
    </div>
  );
}
