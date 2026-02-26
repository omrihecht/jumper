import { useGameStore } from '../state/gameStore';

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.6)',
  color: 'white',
  fontFamily: 'sans-serif',
  gap: 16,
};

const headingStyle: React.CSSProperties = {
  fontSize: 56,
  margin: 0,
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 32px',
  fontSize: 20,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  background: '#4fc3f7',
  color: '#000',
  fontWeight: 'bold',
};

export function GameOverOverlay() {
  const phase = useGameStore((s) => s.phase);
  const score = useGameStore((s) => s.score);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const returnToMenu = useGameStore((s) => s.returnToMenu);

  return (
    <div style={overlayStyle}>
      <h1 style={headingStyle}>
        {phase === 'won' ? 'You Win!' : 'Game Over'}
      </h1>
      <p style={{ fontSize: 24 }}>Score: {score}</p>
      <p style={{ fontSize: 20 }}>Time: {elapsedTime.toFixed(1)}s</p>
      <button onClick={returnToMenu} style={buttonStyle}>
        Play Again
      </button>
    </div>
  );
}
