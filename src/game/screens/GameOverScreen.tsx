import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import { useScreenSync } from '../state/useScreenSync';
import s from '../ui/ui.module.scss';

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
    <div className={s.overlay}>
      <h1>Game Over</h1>
      <p>Score: {score}</p>
      <p>Time: {elapsedTime.toFixed(1)}s</p>
      <button onClick={handlePlayAgain}>Play Again</button>
    </div>
  );
}
