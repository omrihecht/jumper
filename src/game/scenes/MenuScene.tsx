import { AutoPanCamera } from '../camera/AutoPanCamera';
import { Lighting } from '../environment/Lighting';
import { Sky } from '../environment/Sky';
import { Starfield } from '../environment/Starfield';

/**
 * Title / start screen scene.
 * Renders a minimal 3D backdrop behind the menu UI overlay
 * with a slow orbiting camera for visual interest.
 */
export function MenuScene() {
  return (
    <>
      <AutoPanCamera radius={30} speed={0.08} height={12} verticalAmplitude={4} verticalFrequency={0.7} />
      <Lighting />
      <Sky />
      <Starfield />
    </>
  );
}
