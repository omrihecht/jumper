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
import { useDevStore } from './dev/devStore';

export function Game() {
  const phase = useGameStore((s) => s.phase);
  const fov = useDevStore((s) => s.camera.fov);
  const gravity = useDevStore((s) => s.physics.gravity);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas
        camera={{
          fov,
          near: CAMERA.near,
          far: CAMERA.far,
          position: CAMERA.offset,
        }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, gravity, 0]}>
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
