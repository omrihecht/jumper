import { useGameStore } from '../state/gameStore';
import { HUD } from './HUD';
import { PauseMenu } from './PauseMenu';

/**
 * Wrapper that composes all HTML overlay UI based on game phase.
 * Rendered outside the Canvas so it sits on top of the 3D scene.
 */
export function GameUI() {
  const phase = useGameStore((s) => s.phase);

  return (
    <>
      {phase === 'menu' && <MenuOverlay />}
      {(phase === 'playing' || phase === 'paused') && <HUD />}
      {phase === 'paused' && <PauseMenu />}
      {(phase === 'won' || phase === 'lost') && <GameOverOverlay />}
    </>
  );
}

function MenuOverlay() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'sans-serif',
        gap: 24,
        pointerEvents: 'auto',
      }}
    >
      <h1 style={{ fontSize: 64, margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Jumper
      </h1>
      <button
        onClick={startGame}
        style={{
          padding: '16px 48px',
          fontSize: 24,
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          background: '#66bb6a',
          color: '#fff',
          fontWeight: 'bold',
        }}
      >
        Start Game
      </button>
    </div>
  );
}

function GameOverOverlay() {
  const phase = useGameStore((s) => s.phase);
  const score = useGameStore((s) => s.score);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const returnToMenu = useGameStore((s) => s.returnToMenu);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        fontFamily: 'sans-serif',
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 56, margin: 0 }}>
        {phase === 'won' ? 'You Win!' : 'Game Over'}
      </h1>
      <p style={{ fontSize: 24 }}>Score: {score}</p>
      <p style={{ fontSize: 20 }}>Time: {elapsedTime.toFixed(1)}s</p>
      <button
        onClick={returnToMenu}
        style={{
          padding: '12px 32px',
          fontSize: 20,
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          background: '#4fc3f7',
          color: '#000',
          fontWeight: 'bold',
        }}
      >
        Play Again
      </button>
    </div>
  );
}
