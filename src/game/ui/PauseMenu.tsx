import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import s from './ui.module.scss';

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
    <div className={s.pause}>
      <h1>Paused</h1>
      <button onClick={resumeGame}>Resume</button>
      <button onClick={handleQuit}>Quit to Menu</button>
    </div>
  );
}
