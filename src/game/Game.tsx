import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';
import { CAMERA, PHYSICS } from './config/gameConfig';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';
import { GameOverScene } from './scenes/GameOverScene';
import { GameUI } from './ui/GameUI';
import { DevPanel } from './dev/DevPanel';
import { useGameStore } from './state/gameStore';

const rootStyle = { width: '100vw', height: '100vh', overflow: 'hidden' } as const;

export function Game() {
  const phase = useGameStore((s) => s.phase);

  return (
    <div style={rootStyle}>
      <Canvas
        camera={{
          fov: CAMERA.fov,
          near: CAMERA.near,
          far: CAMERA.far,
          position: CAMERA.offset,
        }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, PHYSICS.gravity, 0]}>
            {phase === 'menu' && <MenuScene />}
            {(phase === 'playing' || phase === 'paused') && <GameScene />}
            {(phase === 'won' || phase === 'lost') && <GameOverScene />}
          </Physics>
        </Suspense>
      </Canvas>
      <GameUI />
      <DevPanel />
    </div>
  );
}
