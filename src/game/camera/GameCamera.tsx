import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CAMERA, PLAYER } from '../config/gameConfig';
import { useGameStore } from '../state/gameStore';
import { useDevStore } from '../dev/devStore';
import { useCameraDebugTracking } from './useCameraDebugTracking';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const EPSILON = 0.001;

export function GameCamera() {
  const camera = useThree((s) => s.camera);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const lastPlayerZ = useRef(PLAYER.startPosition[2]);
  const lastResetCount = useRef(0);

  useCameraDebugTracking(controlsRef);

  useEffect(() => {
    camera.position.set(CAMERA.offset[0], CAMERA.offset[1], CAMERA.offset[2]);
    lastPlayerZ.current = PLAYER.startPosition[2];
  }, [camera]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const { resetCount } = useGameStore.getState();
    if (resetCount !== lastResetCount.current) {
      lastResetCount.current = resetCount;
      camera.position.set(CAMERA.offset[0], CAMERA.offset[1], CAMERA.offset[2]);
      controls.target.set(CAMERA.lookAt[0], CAMERA.lookAt[1], CAMERA.lookAt[2]);
      lastPlayerZ.current = PLAYER.startPosition[2];
    }

    const { fov } = useDevStore.getState().camera;
    if (Math.abs(camera.fov - fov) > 0.1) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    const playerZ = useGameStore.getState().player.position[2];
    const dz = playerZ - lastPlayerZ.current;
    lastPlayerZ.current = playerZ;

    if (Math.abs(dz) > EPSILON) {
      controls.target.z += dz;
      camera.position.z += dz;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[...CAMERA.lookAt]}
      enableDamping
      dampingFactor={CAMERA.dampingFactor}
      minDistance={CAMERA.minDistance}
      maxDistance={CAMERA.maxDistance}
      maxPolarAngle={CAMERA.maxPolarAngle}
    />
  );
}
