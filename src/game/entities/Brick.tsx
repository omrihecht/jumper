import { useRef, useCallback, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody, CollisionEnterPayload } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useWaveAnimation } from '../systems/useWaveAnimation';
import { useGameStore } from '../state/gameStore';
import { Color, MeshBasicMaterial } from 'three';
import type { Group, Mesh } from 'three';

const HIT_COLORS = [
  '#ff00ff', '#00ffff', '#39ff14', '#ffff00',
  '#ff3131', '#00bfff', '#ff6ec7', '#bf00ff',
  '#00fff7', '#7fff00', '#ff9500', '#ff355e',
];

function randomHitColor() {
  return HIT_COLORS[Math.floor(Math.random() * HIT_COLORS.length)];
}

const SHADOW_MAX_HEIGHT = 10;
const SHADOW_XZ_THRESHOLD = 1.2;

export interface BrickProps {
  col: number;
  row: number;
  x: number;
  z: number;
  size: readonly [number, number, number];
  color: string;
  phaseOffset: number;
}

/**
 * Single oscillating brick with player proximity shadow
 * and neon glow on contact.
 */
const SHADOW_BASE_SIZE = 0.6;
const SHADOW_BLUR_SCALE = 1.8;

export function Brick({ x, z, size, color, phaseOffset }: BrickProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const shadowGroupRef = useRef<Group>(null);
  const [hitColor, setHitColor] = useState<string | null>(null);
  const contactCount = useRef(0);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useWaveAnimation(rigidBodyRef, x, z, phaseOffset);

  useFrame(() => {
    const group = shadowGroupRef.current;
    const body = rigidBodyRef.current;
    if (!group || !body) return;

    const [px, py, pz] = useGameStore.getState().player.position;
    const brickPos = body.translation();

    const dx = Math.abs(px - brickPos.x);
    const dz = Math.abs(pz - brickPos.z);
    const dy = py - brickPos.y;

    const directlyBelow = dx < SHADOW_XZ_THRESHOLD && dz < SHADOW_XZ_THRESHOLD && dy > 0;
    const t = directlyBelow ? Math.max(0, 1 - dy / SHADOW_MAX_HEIGHT) : 0;
    group.visible = t > 0.01;

    if (group.visible) {
      group.position.x = px - brickPos.x;
      group.position.z = pz - brickPos.z;

      // Close = sharp & full size, far = small & blurred (spread layers)
      const scale = SHADOW_BASE_SIZE * (0.4 + 0.6 * t);
      const blur = (1 - t) * SHADOW_BLUR_SCALE;

      const children = group.children as Mesh[];
      const core = children[0];
      core.scale.set(scale, scale, 1);
      (core.material as MeshBasicMaterial).opacity = t * 0.8;
      for (let i = 1; i < children.length; i++) {
        const layerScale = scale + blur * (i * 0.4);
        children[i].scale.set(layerScale, layerScale, 1);
        (children[i].material as MeshBasicMaterial).opacity = t * 0.2 * (1 - i / children.length);
      }
    }
  });

  const onCollisionEnter = useCallback((_payload: CollisionEnterPayload) => {
    contactCount.current++;
    if (exitTimer.current) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    setHitColor((prev) => prev ?? randomHitColor());
  }, []);

  const onCollisionExit = useCallback(() => {
    contactCount.current = Math.max(0, contactCount.current - 1);
    if (contactCount.current === 0) {
      exitTimer.current = setTimeout(() => {
        if (contactCount.current === 0) {
          setHitColor(null);
        }
        exitTimer.current = null;
      }, 100);
    }
  }, []);

  const isHit = hitColor !== null;
  const halfH = size[1] / 2 + 0.01;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      position={[x, 0, z]}
      colliders="cuboid"
      onCollisionEnter={onCollisionEnter}
      onCollisionExit={onCollisionExit}
    >
      <mesh receiveShadow>
        <boxGeometry args={[...size]} />
        <meshStandardMaterial
          color={isHit ? hitColor : color}
          emissive={isHit ? new Color(hitColor) : new Color(color).multiplyScalar(0.15)}
          emissiveIntensity={isHit ? 2.5 : 0.3}
          toneMapped={false}
        />
      </mesh>
      <group ref={shadowGroupRef} position={[0, halfH, 0]} visible={false}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[0, i * 0.001, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
}
