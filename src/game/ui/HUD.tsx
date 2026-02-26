import type { CSSProperties } from 'react';
import { useGameStore } from '../state/gameStore';
import { useCameraDebugStore } from '../camera/cameraDebugStore';

const statsStyle: CSSProperties = {
  position: 'absolute',
  top: 16,
  left: 16,
  color: 'white',
  fontFamily: 'monospace',
  fontSize: 18,
  pointerEvents: 'none',
  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
};

const debugStyle: CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 16,
  color: 'white',
  fontFamily: 'monospace',
  fontSize: 14,
  pointerEvents: 'none',
  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
  textAlign: 'right',
};

export function HUD() {
  const score = useGameStore((s) => s.score);
  const lives = useGameStore((s) => s.lives);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const camPos = useCameraDebugStore((s) => s.position);
  const camTarget = useCameraDebugStore((s) => s.target);

  return (
    <>
      <div style={statsStyle}>
        <div>Score: {score}</div>
        <div>Lives: {'♥'.repeat(lives)}</div>
        <div>Time: {elapsedTime.toFixed(1)}s</div>
      </div>
      <div style={debugStyle}>
        <div>cam pos: [{camPos.join(', ')}]</div>
        <div>cam target: [{camTarget.join(', ')}]</div>
      </div>
    </>
  );
}
