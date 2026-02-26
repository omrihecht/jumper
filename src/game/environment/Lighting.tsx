import { LIGHTING } from '../config/gameConfig';

export function Lighting() {
  return (
    <>
      <ambientLight intensity={LIGHTING.ambientIntensity} />
      <directionalLight
        position={[...LIGHTING.directionalPosition]}
        intensity={LIGHTING.directionalIntensity}
        castShadow
        shadow-mapSize-width={LIGHTING.shadowMapSize}
        shadow-mapSize-height={LIGHTING.shadowMapSize}
        shadow-camera-far={LIGHTING.shadowCameraFar}
        shadow-camera-left={-LIGHTING.shadowCameraExtent}
        shadow-camera-right={LIGHTING.shadowCameraExtent}
        shadow-camera-top={LIGHTING.shadowCameraExtent}
        shadow-camera-bottom={-LIGHTING.shadowCameraExtent}
      />
    </>
  );
}
