import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import { useScreenSync } from '../state/useScreenSync';
import { overlayStyle, headingStyle, buttonStyle, scoreTextStyle, timeTextStyle } from '../ui/styles';

const winHeadingStyle: React.CSSProperties = {
  ...headingStyle,
  textShadow: '0 0 30px rgba(79,195,247,0.8)',
};

/** Victory overlay shown after completing all levels. */
export function YouWinScreen() {
  const score = useGameStore((s) => s.score);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const navigate = useNavigate();
  useScreenSync('you-win');

  const handlePlayAgain = () => {
    useGameStore.getState().returnToMenu();
    navigate('/');
  };

  return (
    <div style={overlayStyle}>
      <h1 style={winHeadingStyle}>You Win!</h1>
      <p style={scoreTextStyle}>Score: {score}</p>
      <p style={timeTextStyle}>Time: {elapsedTime.toFixed(1)}s</p>
      <button onClick={handlePlayAgain} style={buttonStyle}>
        Play Again
      </button>
    </div>
  );
}
