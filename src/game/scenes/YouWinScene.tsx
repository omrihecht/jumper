import { AutoPanCamera } from '../camera/AutoPanCamera';
import { Lighting } from '../environment/Lighting';
import { Sky } from '../environment/Sky';
import { Starfield } from '../environment/Starfield';
import { Confetti } from '../environment/Confetti';

/** Win screen 3D backdrop with celebratory confetti. */
export function YouWinScene() {
  return (
    <>
      <AutoPanCamera radius={25} speed={0.1} height={10} />
      <Lighting />
      <Sky />
      <Starfield />
      <Confetti />
    </>
  );
}
