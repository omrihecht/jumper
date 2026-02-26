import { useGameStore } from '../state/gameStore';
import { HUD } from './HUD';
import { PauseMenu } from './PauseMenu';
import { MenuOverlay } from './MenuOverlay';
import { GameOverOverlay } from './GameOverOverlay';

/**
 * Composes all HTML overlay UI based on game phase.
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
