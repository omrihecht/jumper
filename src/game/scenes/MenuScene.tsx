import { Lighting } from '../environment/Lighting';
import { Sky } from '../environment/Sky';

/**
 * Title / start screen scene.
 * Renders a minimal 3D backdrop behind the menu UI overlay.
 */
export function MenuScene() {
  return (
    <>
      <Lighting />
      <Sky />
      {/* TODO: Add decorative elements or animated preview */}
    </>
  );
}
