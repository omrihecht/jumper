import { useFrame } from '@react-three/fiber';
import { Lighting } from '../environment/Lighting';
import { Sky } from '../environment/Sky';
import { Starfield } from '../environment/Starfield';

const PAN_RADIUS = 30;
const PAN_SPEED = 0.08;
const PAN_HEIGHT = 12;

function AutoPanCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * PAN_SPEED;
    camera.position.x = Math.sin(t) * PAN_RADIUS;
    camera.position.y = PAN_HEIGHT + Math.sin(t * 0.7) * 4;
    camera.position.z = Math.cos(t) * PAN_RADIUS;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Title / start screen scene.
 * Renders a minimal 3D backdrop behind the menu UI overlay
 * with a slow orbiting camera for visual interest.
 */
export function MenuScene() {
  return (
    <>
      <AutoPanCamera />
      <Lighting />
      <Sky />
      <Starfield />
    </>
  );
}
