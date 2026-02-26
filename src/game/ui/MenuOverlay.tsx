import { useGameStore } from '../state/gameStore';

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontFamily: 'sans-serif',
  gap: 24,
  pointerEvents: 'auto',
};

const titleStyle: React.CSSProperties = {
  fontSize: 64,
  margin: 0,
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
};

const buttonStyle: React.CSSProperties = {
  padding: '16px 48px',
  fontSize: 24,
  border: 'none',
  borderRadius: 12,
  cursor: 'pointer',
  background: '#66bb6a',
  color: '#fff',
  fontWeight: 'bold',
};

export function MenuOverlay() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div style={overlayStyle}>
      <h1 style={titleStyle}>Jumper</h1>
      <button onClick={startGame} style={buttonStyle}>
        Start Game
      </button>
    </div>
  );
}
