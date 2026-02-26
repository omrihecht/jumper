import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import { useScreenSync } from '../state/useScreenSync';
import { overlayStyle, headingStyle, buttonStyle, scoreTextStyle, timeTextStyle } from '../ui/styles';

/** Game-over overlay showing final score and a retry button. */
export function GameOverScreen() {
  const score = useGameStore((s) => s.score);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const navigate = useNavigate();
  useScreenSync('game-over');

  const handlePlayAgain = () => {
    useGameStore.getState().returnToMenu();
    navigate('/');
  };

  return (
    <div style={overlayStyle}>
      <h1 style={headingStyle}>Game Over</h1>
      <p style={scoreTextStyle}>Score: {score}</p>
      <p style={timeTextStyle}>Time: {elapsedTime.toFixed(1)}s</p>
      <button onClick={handlePlayAgain} style={buttonStyle}>
        Play Again
      </button>
    </div>
  );
}
