import { useGameStore } from '../state/gameStore';
import { MenuScene } from './MenuScene';
import { GameScene } from './GameScene';
import { GameOverScene } from './GameOverScene';
import { YouWinScene } from './YouWinScene';

/**
 * Renders the appropriate 3D scene based on the current screen.
 * Lives inside the shared Canvas so the WebGL context is never destroyed.
 */
export function SceneSwitch() {
  const screen = useGameStore((s) => s.currentScreen);

  switch (screen) {
    case 'menu':
      return <MenuScene />;
    case 'play':
      return <GameScene />;
    case 'game-over':
      return <GameOverScene />;
    case 'you-win':
      return <YouWinScene />;
  }
}
