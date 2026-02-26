import { createBrowserRouter } from 'react-router-dom';
import { GameLayout } from '../game/GameLayout';
import { MenuScreen } from '../game/screens/MenuScreen';
import { PlayScreen } from '../game/screens/PlayScreen';
import { GameOverScreen } from '../game/screens/GameOverScreen';
import { YouWinScreen } from '../game/screens/YouWinScreen';
import { DocsPage } from './DocsPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <GameLayout />,
      children: [
        { index: true, element: <MenuScreen /> },
        { path: 'play', element: <PlayScreen /> },
        { path: 'game-over', element: <GameOverScreen /> },
        { path: 'you-win', element: <YouWinScreen /> },
      ],
    },
    { path: '/docs', element: <DocsPage /> },
  ],
  { basename: '/jumper' },
);
