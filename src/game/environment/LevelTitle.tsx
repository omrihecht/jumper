import { Text } from '@react-three/drei';
import { useGameStore } from '../state/gameStore';

const FONT_URL = '/jumper/fonts/Caveat-Regular.ttf';

/**
 * Renders the current level name as large, low-opacity 3D text
 * centered behind the brick sea.
 */
export function LevelTitle() {
  const level = useGameStore((s) => s.currentLevel);
  const z = -(level.startGap + level.gridRows * level.brickSpacing + level.endGap + 10);

  return (
    <Text
      position={[0, 8, z]}
      fontSize={8}
      font={FONT_URL}
      color="#ffffff"
      fillOpacity={0.2}
      anchorX="center"
      anchorY="middle"
      depthOffset={1}
    >
      {level.name}
    </Text>
  );
}
