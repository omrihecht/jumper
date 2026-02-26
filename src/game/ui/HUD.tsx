import { useGameStore } from '../state/gameStore';
import { useCameraDebugStore } from '../camera/cameraDebugStore';
import s from './ui.module.css';

export function HUD() {
  const score = useGameStore((s) => s.score);
  const lives = useGameStore((s) => s.lives);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const camPos = useCameraDebugStore((s) => s.position);
  const camTarget = useCameraDebugStore((s) => s.target);

  return (
    <>
      <div className={s.stats}>
        <div>Score: {score}</div>
        <div>Lives: {'♥'.repeat(lives)}</div>
        <div>Time: {elapsedTime.toFixed(1)}s</div>
      </div>
      <div className={s.debug}>
        <div>cam pos: [{camPos.join(', ')}]</div>
        <div>cam target: [{camTarget.join(', ')}]</div>
      </div>
    </>
  );
}
