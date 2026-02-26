import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
} from 'three';

const PARTICLE_COUNT = 600;
const SPREAD_X = 30;
const SPREAD_Z = 30;
const HEIGHT = 40;
const FALL_SPEED = 4;
const DRIFT_SPEED = 0.6;

const NEON_COLORS = [
  [1, 0.2, 0.4],
  [0.2, 1, 0.4],
  [0.2, 0.6, 1],
  [1, 0.9, 0.1],
  [1, 0.4, 0.9],
  [0, 0.9, 1],
] as const;

/** Falling confetti particles for the victory screen. */
export function Confetti() {
  const { geometry, material, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    const off = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD_X;
      positions[i * 3 + 1] = Math.random() * HEIGHT;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;

      const c = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];

      spd[i] = 0.6 + Math.random() * 0.8;
      off[i] = Math.random() * Math.PI * 2;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));

    const mat = new PointsMaterial({
      size: 0.5,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    return { geometry: geo, material: mat, speeds: spd, offsets: off };
  }, []);

  useFrame(({ clock }) => {
    const positions = geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3 + 1] -= FALL_SPEED * speeds[i] * 0.016;
      positions[i3] += Math.sin(t * DRIFT_SPEED + offsets[i]) * 0.02;

      if (positions[i3 + 1] < -5) {
        positions[i3 + 1] = HEIGHT;
        positions[i3] = (Math.random() - 0.5) * SPREAD_X;
        positions[i3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
      }
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} />;
}
