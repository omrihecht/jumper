import { createBrowserRouter } from 'react-router-dom';
import { Game } from '../game/Game';
import { DocsPage } from './DocsPage';

export const router = createBrowserRouter(
  [
    { path: '/', element: <Game /> },
    { path: '/docs', element: <DocsPage /> },
  ],
  { basename: '/jumper' },
);
