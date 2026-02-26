import { memo } from 'react';
import { useGameStore } from '../state/gameStore';
import { useCameraDebugStore } from '../camera/cameraDebugStore';
import s from './ui.module.scss';

const CameraDebug = memo(function CameraDebug() {
  const camPos = useCameraDebugStore((st) => st.position);
  const camTarget = useCameraDebugStore((st) => st.target);

  return (
    <div className={s.debug}>
      <div>cam pos: [{camPos.join(', ')}]</div>
      <div>cam target: [{camTarget.join(', ')}]</div>
    </div>
  );
});

export function HUD() {
  const score = useGameStore((st) => st.score);
  const lives = useGameStore((st) => st.lives);
  const elapsedTime = useGameStore((st) => st.elapsedTime);

  return (
    <>
      <div className={s.stats}>
        <div>Score: {score}</div>
        <div>Lives: {'♥'.repeat(lives)}</div>
        <div>Time: {elapsedTime.toFixed(1)}s</div>
      </div>
      <CameraDebug />
    </>
  );
}
