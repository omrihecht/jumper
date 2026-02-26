import { useFrame, useThree } from '@react-three/fiber';
import { useCameraDebugStore } from './cameraDebugStore';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { RefObject } from 'react';

/**
 * Pushes rounded camera position and orbit target to
 * the debug store, but only when values actually change.
 */
export function useCameraDebugTracking(
  controlsRef: RefObject<OrbitControlsImpl | null>,
) {
  const camera = useThree((s) => s.camera);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const debugStore = useCameraDebugStore.getState();

    const p = camera.position;
    const rpx = Math.round(p.x * 10) / 10;
    const rpy = Math.round(p.y * 10) / 10;
    const rpz = Math.round(p.z * 10) / 10;
    const dp = debugStore.position;
    if (rpx !== dp[0] || rpy !== dp[1] || rpz !== dp[2]) {
      debugStore.setPosition([rpx, rpy, rpz]);
    }

    const t = controls.target;
    const rtx = Math.round(t.x * 10) / 10;
    const rty = Math.round(t.y * 10) / 10;
    const rtz = Math.round(t.z * 10) / 10;
    const dt = debugStore.target;
    if (rtx !== dt[0] || rty !== dt[1] || rtz !== dt[2]) {
      debugStore.setTarget([rtx, rty, rtz]);
    }
  });
}
