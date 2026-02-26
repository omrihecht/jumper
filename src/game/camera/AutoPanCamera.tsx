import { useFrame } from '@react-three/fiber';

interface AutoPanCameraProps {
  radius?: number;
  speed?: number;
  height?: number;
  /** Amplitude of the vertical bobbing motion. */
  verticalAmplitude?: number;
  /** Frequency multiplier for the vertical bobbing relative to the orbit. */
  verticalFrequency?: number;
}

/**
 * Orbiting camera controller used on non-gameplay screens
 * (menu, game-over, you-win) for visual interest behind overlays.
 */
export function AutoPanCamera({
  radius = 25,
  speed = 0.08,
  height = 10,
  verticalAmplitude = 3,
  verticalFrequency = 0.5,
}: AutoPanCameraProps) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * speed;
    camera.position.x = Math.sin(t) * radius;
    camera.position.y = height + Math.sin(t * verticalFrequency) * verticalAmplitude;
    camera.position.z = Math.cos(t) * radius;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
