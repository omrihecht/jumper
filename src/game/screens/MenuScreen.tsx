import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import { useScreenSync } from '../state/useScreenSync';
import s from '../ui/ui.module.scss';

/** Start / title screen overlay. */
export function MenuScreen() {
  const navigate = useNavigate();
  useScreenSync('menu');

  const handleStart = () => {
    useGameStore.getState().startGame();
    navigate('/play');
  };

  return (
    <div className={s.transparent}>
      <h1>Jumper</h1>
      <button onClick={handleStart}>Start Game</button>
    </div>
  );
}
