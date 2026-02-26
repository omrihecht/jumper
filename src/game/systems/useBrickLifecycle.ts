import { useFrame } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import type { Group, Mesh, MeshPhysicalMaterial, LineSegments, LineBasicMaterial } from 'three';
import { BRICK_LIFECYCLE } from '../config/gameConfig';

const HIDE_Y = -500;
const BASE_OPACITY = 0.35;
const HIT_OPACITY = 0.55;
const EDGE_BASE_OPACITY = 0.4;

/**
 * Cycles a brick's Y-scale through a sine curve (0 → 1 → 0),
 * then holds it invisible for a pause before repeating.
 *
 * Must be registered after useWaveAnimation so it can override
 * the body position — when the brick is gone the body is moved
 * far below the scene, physically removing the surface from
 * under the player.
 *
 * Below the fade threshold, opacity ramps down to 0.
 */
export function useBrickLifecycle(
  rigidBodyRef: React.RefObject<RapierRigidBody | null>,
  meshGroupRef: React.RefObject<Group | null>,
  phaseOffset: number,
  brickHeight: number,
) {
  useFrame(({ clock }) => {
    const body = rigidBodyRef.current;
    const group = meshGroupRef.current;
    if (!body || !group) return;

    const { visibleDuration, vanishDuration, disableThreshold, fadeThreshold } = BRICK_LIFECYCLE;
    const cycle = visibleDuration + vanishDuration;
    const t = (clock.getElapsedTime() + phaseOffset * 2.5) % cycle;

    let scale: number;
    if (t < visibleDuration) {
      scale = Math.sin((t / visibleDuration) * Math.PI);
    } else {
      scale = 0;
    }

    group.scale.y = scale;
    group.position.y = brickHeight * (1 - scale) / 2;
    group.visible = scale > 0.001;

    const fadeAlpha = scale < fadeThreshold ? scale / fadeThreshold : 1;

    const mesh = group.children[0] as Mesh;
    const meshMat = mesh.material as MeshPhysicalMaterial;
    const isHit = meshMat.emissiveIntensity > 1;
    meshMat.opacity = (isHit ? HIT_OPACITY : BASE_OPACITY) * fadeAlpha;

    const edges = group.children[1] as LineSegments;
    (edges.material as LineBasicMaterial).opacity = EDGE_BASE_OPACITY * fadeAlpha;

    if (scale <= disableThreshold) {
      const pos = body.translation();
      body.setNextKinematicTranslation({ x: pos.x, y: HIDE_Y, z: pos.z });
    }
  });
}
