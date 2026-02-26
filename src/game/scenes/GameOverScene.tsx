import { Lighting } from '../environment/Lighting';
import { Sky } from '../environment/Sky';

/**
 * Win/lose screen scene.
 * Shows a 3D backdrop while the GameUI overlay displays results.
 */
export function GameOverScene() {
  return (
    <>
      <Lighting />
      <Sky />
      {/* TODO: Add victory/defeat visual effects */}
    </>
  );
}
