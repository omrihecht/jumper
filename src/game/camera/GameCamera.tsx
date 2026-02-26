import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { CAMERA, PLAYER } from '../config/gameConfig';
import { useGameStore } from '../state/gameStore';
import { useDevStore } from '../dev/devStore';
import { useCameraDebugStore } from './cameraDebugStore';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export function GameCamera() {
  const camera = useThree((s) => s.camera);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const lastPlayerZ = useRef(PLAYER.startPosition[2]);

  useEffect(() => {
    camera.position.set(CAMERA.offset[0], CAMERA.offset[1], CAMERA.offset[2]);
    lastPlayerZ.current = PLAYER.startPosition[2];
  }, [camera]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const { fov } = useDevStore.getState().camera;
    if (Math.abs(camera.fov - fov) > 0.1) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    const playerZ = useGameStore.getState().player.position[2];
    const dz = playerZ - lastPlayerZ.current;
    lastPlayerZ.current = playerZ;

    if (Math.abs(dz) > 0.001) {
      controls.target.z += dz;
      camera.position.z += dz;
    }

    const p = camera.position;
    useCameraDebugStore.getState().setPosition([
      Math.round(p.x * 10) / 10,
      Math.round(p.y * 10) / 10,
      Math.round(p.z * 10) / 10,
    ]);
    const t = controls.target;
    useCameraDebugStore.getState().setTarget([
      Math.round(t.x * 10) / 10,
      Math.round(t.y * 10) / 10,
      Math.round(t.z * 10) / 10,
    ]);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[...CAMERA.lookAt]}
      enableDamping
      dampingFactor={0.1}
      minDistance={5}
      maxDistance={150}
      maxPolarAngle={Math.PI / 2.1}
    />
  );
}
