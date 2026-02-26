import { useGameStore } from '../state/gameStore';

/**
 * Pause overlay with resume and quit options.
 * Visible only when game phase is 'paused'.
 */
export function PauseMenu() {
  const resumeGame = useGameStore((s) => s.resumeGame);
  const returnToMenu = useGameStore((s) => s.returnToMenu);

  return (
    <div
      style={{
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
      }}
    >
      <h1 style={{ fontSize: 48, margin: 0 }}>Paused</h1>
      <button onClick={resumeGame} style={buttonStyle}>
        Resume
      </button>
      <button onClick={returnToMenu} style={buttonStyle}>
        Quit to Menu
      </button>
    </div>
  );
}

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
