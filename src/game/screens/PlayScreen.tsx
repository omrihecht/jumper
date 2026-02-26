import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../state/gameStore';
import { HUD } from '../ui/HUD';
import { PauseMenu } from '../ui/PauseMenu';
import { LevelUpOverlay } from '../ui/LevelUpOverlay';

/**
 * Gameplay route UI — renders the HUD, pause menu, and level-up overlay.
 *
 * On a direct page refresh to /play the store resets to idle/menu.
 * The effect detects this and calls startGame() to bootstrap a new session.
 * During normal game-over / you-win transitions the store's currentScreen
 * tells us which end-screen to navigate to.
 */
export function PlayScreen() {
  const phase = useGameStore((s) => s.phase);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (phase !== 'idle') return;

    const screen = useGameStore.getState().currentScreen;
    if (screen === 'game-over') {
      navigate('/game-over', { replace: true });
    } else if (screen === 'you-win') {
      navigate('/you-win', { replace: true });
    } else {
      useGameStore.getState().startGame();
    }
  }, [phase, navigate]);

  return (
    <>
      {(phase === 'playing' || phase === 'paused') && <HUD />}
      {phase === 'paused' && <PauseMenu />}
      {phase === 'level_up' && <LevelUpOverlay />}
    </>
  );
}
