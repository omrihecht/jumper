import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';
import { CAMERA, PHYSICS } from './config/gameConfig';
import { DevPanel } from './dev/DevPanel';
import { registerNavigate } from './navigation';
import { SceneSwitch } from './scenes/SceneSwitch';
import s from './game.module.css';

const cameraProps = {
  fov: CAMERA.fov,
  near: CAMERA.near,
  far: CAMERA.far,
  position: CAMERA.offset,
} as const;

const gravityVec = [0, PHYSICS.gravity, 0] as const;

export function GameLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate]);

  return (
    <div className={s.root}>
      <Canvas camera={cameraProps}>
        <Suspense fallback={null}>
          <Physics gravity={gravityVec}>
            <SceneSwitch />
          </Physics>
        </Suspense>
      </Canvas>
      <Outlet />
      <DevPanel />
    </div>
  );
}
