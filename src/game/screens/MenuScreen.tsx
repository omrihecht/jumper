import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import { useScreenSync } from '../state/useScreenSync';
import s from '../ui/ui.module.css';

/** Start / title screen overlay. */
export function MenuScreen() {
  const navigate = useNavigate();
  useScreenSync('menu');

  const handleStart = () => {
    useGameStore.getState().startGame();
    navigate('/play');
  };

  return (
    <div className={s.overlayTransparent}>
      <h1 className={s.heading}>Jumper</h1>
      <button onClick={handleStart} className={s.button}>
        Start Game
      </button>
    </div>
  );
}
