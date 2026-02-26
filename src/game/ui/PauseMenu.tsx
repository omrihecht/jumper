import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import { overlayStyle, headingStyle, buttonStyle } from './styles';

const pauseHeadingStyle: React.CSSProperties = {
  ...headingStyle,
  fontSize: 48,
};

/**
 * Pause overlay with resume and quit options.
 * Visible only when game phase is 'paused'.
 */
export function PauseMenu() {
  const resumeGame = useGameStore((s) => s.resumeGame);
  const navigate = useNavigate();

  const handleQuit = () => {
    useGameStore.getState().returnToMenu();
    navigate('/');
  };

  return (
    <div style={overlayStyle}>
      <h1 style={pauseHeadingStyle}>Paused</h1>
      <button onClick={resumeGame} style={buttonStyle}>
        Resume
      </button>
      <button onClick={handleQuit} style={buttonStyle}>
        Quit to Menu
      </button>
    </div>
  );
}
