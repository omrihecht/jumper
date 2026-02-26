import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import { useScreenSync } from '../state/useScreenSync';
import s from '../ui/ui.module.scss';

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
    <div className={s.overlay}>
      <h1 className={s.headingGlow}>You Win!</h1>
      <p className={s.scoreText}>Score: {score}</p>
      <p className={s.timeText}>Time: {elapsedTime.toFixed(1)}s</p>
      <button onClick={handlePlayAgain} className={s.button}>
        Play Again
      </button>
    </div>
  );
}
