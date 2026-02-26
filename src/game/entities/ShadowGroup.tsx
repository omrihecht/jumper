import { forwardRef } from 'react';
import type { Group } from 'three';
import { PlaneGeometry } from 'three';
import { SHADOW_LAYER_COUNT } from '../systems/useBrickShadow';

const SHARED_GEO = new PlaneGeometry(1, 1);
const LAYER_INDICES = Array.from({ length: SHADOW_LAYER_COUNT }, (_, i) => i);

interface ShadowGroupProps {
  yOffset: number;
}

/**
 * Reusable multi-layer shadow plane group.
 * Shares geometry across all instances; each brick gets its own
 * material instances so useBrickShadow can set opacity independently.
 * Position and visibility are controlled by useBrickShadow.
 */
export const ShadowGroup = forwardRef<Group, ShadowGroupProps>(
  function ShadowGroup({ yOffset }, ref) {
    return (
      <group ref={ref} position={[0, yOffset, 0]} visible={false}>
        {LAYER_INDICES.map((i) => (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[0, i * 0.001, 0]} geometry={SHARED_GEO}>
            <meshBasicMaterial color="#000000" transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
    );
  },
);
