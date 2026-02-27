import { useDevStore } from './devStore';
import { Slider } from './Slider';

export function CameraControls() {
  const camera = useDevStore((s) => s.camera);
  const setCamera = useDevStore((s) => s.setCamera);

  return (
    <div>
      <h4>Camera</h4>
      <Slider label="FOV" value={camera.fov} min={30} max={120} step={1} onChange={(v) => setCamera({ fov: v })} />
    </div>
  );
}
