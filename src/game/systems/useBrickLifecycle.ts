import { useRef } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { Color } from 'three';
import type { Group, Mesh, MeshPhysicalMaterial, LineSegments, LineBasicMaterial } from 'three';
import { BRICK_LIFECYCLE } from '../config/gameConfig';

const HIDE_Y = -500;
const BASE_COLOR = '#8a8a8a';
const BASE_OPACITY = 0.35;
const HIT_OPACITY = 0.55;
const EDGE_BASE_OPACITY = 0.4;
const BASE_EMISSIVE = new Color(BASE_COLOR).multiplyScalar(0.05);
const _color = new Color();

/**
 * Manages the full visual lifecycle of a brick each frame:
 *   - Y-scale sine curve (grow → shrink → vanish → pause → repeat)
 *   - Top-anchored scaling
 *   - Opacity fade near zero scale
 *   - Hit glow color/emissive (reads hitColorRef from useBrickHitGlow)
 *   - Rigid body teleport when vanished
 *
 * Must be registered after useWaveAnimation so it can override
 * the body position.
 */
export function useBrickLifecycle(
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  meshGroupRef: RefObject<Group | null>,
  hitColorRef: MutableRefObject<string | null>,
  phaseOffset: number,
  brickHeight: number,
) {
  const randomOffset = useRef(Math.random() * (BRICK_LIFECYCLE.visibleDuration + BRICK_LIFECYCLE.vanishDuration));

  useFrame(({ clock }) => {
    const body = rigidBodyRef.current;
    const group = meshGroupRef.current;
    if (!body || !group) return;

    const { visibleDuration, vanishDuration, disableThreshold, fadeThreshold } = BRICK_LIFECYCLE;
    const cycle = visibleDuration + vanishDuration;
    const t = (clock.getElapsedTime() + randomOffset.current) % cycle;

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
    const hitColor = hitColorRef.current;
    const isHit = hitColor !== null;

    const mesh = group.children[0] as Mesh;
    const meshMat = mesh.material as MeshPhysicalMaterial;

    if (isHit) {
      _color.set(hitColor);
      meshMat.color.copy(_color);
      meshMat.emissive.copy(_color);
      meshMat.emissiveIntensity = 1.5;
    } else {
      meshMat.color.set(BASE_COLOR);
      meshMat.emissive.copy(BASE_EMISSIVE);
      meshMat.emissiveIntensity = 0.1;
    }

    meshMat.opacity = (isHit ? HIT_OPACITY : BASE_OPACITY) * fadeAlpha;

    const edges = group.children[1] as LineSegments;
    (edges.material as LineBasicMaterial).opacity = EDGE_BASE_OPACITY * fadeAlpha;

    if (scale <= disableThreshold) {
      const pos = body.translation();
      body.setNextKinematicTranslation({ x: pos.x, y: HIDE_Y, z: pos.z });
    }
  });
}
