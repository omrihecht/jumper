import { forwardRef } from 'react';
import type { Group } from 'three';
import { SHADOW_LAYER_COUNT } from '../systems/useBrickShadow';

interface ShadowGroupProps {
  yOffset: number;
}

/**
 * Reusable multi-layer shadow plane group.
 * Position and visibility are controlled by useBrickShadow.
 */
export const ShadowGroup = forwardRef<Group, ShadowGroupProps>(
  function ShadowGroup({ yOffset }, ref) {
    return (
      <group ref={ref} position={[0, yOffset, 0]} visible={false}>
        {Array.from({ length: SHADOW_LAYER_COUNT }, (_, i) => (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[0, i * 0.001, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="#000000" transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
    );
  },
);
