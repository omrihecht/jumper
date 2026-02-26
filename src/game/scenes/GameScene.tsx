import { Player } from '../entities/Player';
import { BrickSea } from '../entities/BrickSea';
import { StartPlatform } from '../entities/StartPlatform';
import { EndPlatform } from '../entities/EndPlatform';
import { GameCamera } from '../camera/GameCamera';
import { Lighting } from '../environment/Lighting';
import { Sky } from '../environment/Sky';
import { Starfield } from '../environment/Starfield';
import { LevelTitle } from '../environment/LevelTitle';
import { useGameLoop } from '../systems/useGameLoop';
import { useDevGravity } from '../dev/useDevGravity';

export function GameScene() {
  useGameLoop();
  useDevGravity();

  return (
    <>
      <Lighting />
      <Sky />
      <Starfield />
      <LevelTitle />
      <GameCamera />
      <StartPlatform />
      <BrickSea />
      <EndPlatform />
      <Player />
    </>
  );
}
