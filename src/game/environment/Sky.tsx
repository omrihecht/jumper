import { ENVIRONMENT } from '../config/gameConfig';

export function Sky() {
  return <color attach="background" args={[ENVIRONMENT.backgroundColor]} />;
}
