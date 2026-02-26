import { Lighting } from '../environment/Lighting';
import { Sky } from '../environment/Sky';
import { Starfield } from '../environment/Starfield';

/**
 * Title / start screen scene.
 * Renders a minimal 3D backdrop behind the menu UI overlay.
 */
export function MenuScene() {
  return (
    <>
      <Lighting />
      <Sky />
      <Starfield />
    </>
  );
}
