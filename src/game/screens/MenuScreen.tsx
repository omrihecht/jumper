import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import { useScreenSync } from '../state/useScreenSync';
import { overlayStyle } from '../ui/styles';

const menuOverlayStyle: React.CSSProperties = {
  ...overlayStyle,
  gap: 24,
  background: 'transparent',
};

const titleStyle: React.CSSProperties = {
  fontSize: 64,
  margin: 0,
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
};

const startButtonStyle: React.CSSProperties = {
  padding: '16px 48px',
  fontSize: 24,
  border: 'none',
  borderRadius: 12,
  cursor: 'pointer',
  background: '#66bb6a',
  color: '#fff',
  fontWeight: 'bold',
};

/** Start / title screen overlay. */
export function MenuScreen() {
  const navigate = useNavigate();
  useScreenSync('menu');

  const handleStart = () => {
    useGameStore.getState().startGame();
    navigate('/play');
  };

  return (
    <div style={menuOverlayStyle}>
      <h1 style={titleStyle}>Jumper</h1>
      <button onClick={handleStart} style={startButtonStyle}>
        Start Game
      </button>
    </div>
  );
}
