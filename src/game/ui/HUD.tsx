import { useGameStore } from '../state/gameStore';
import { useCameraDebugStore } from '../camera/cameraDebugStore';

/**
 * Heads-up display showing score, lives, elapsed time,
 * and live camera coordinates for debugging.
 */
export function HUD() {
  const score = useGameStore((s) => s.score);
  const lives = useGameStore((s) => s.lives);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const camPos = useCameraDebugStore((s) => s.position);
  const camTarget = useCameraDebugStore((s) => s.target);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: 18,
          pointerEvents: 'none',
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
        }}
      >
        <div>Score: {score}</div>
        <div>Lives: {'♥'.repeat(lives)}</div>
        <div>Time: {elapsedTime.toFixed(1)}s</div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: 14,
          pointerEvents: 'none',
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
          textAlign: 'right',
        }}
      >
        <div>cam pos: [{camPos.join(', ')}]</div>
        <div>cam target: [{camTarget.join(', ')}]</div>
      </div>
    </>
  );
}
