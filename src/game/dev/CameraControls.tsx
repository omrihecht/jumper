import { useDevStore } from './devStore';
import { Slider } from './Slider';
import s from './dev.module.css';

export function CameraControls() {
  const camera = useDevStore((s) => s.camera);
  const setCamera = useDevStore((s) => s.setCamera);

  return (
    <div>
      <div className={s.sectionHeader}>Camera</div>
      <Slider label="FOV" value={camera.fov} min={30} max={120} step={1} onChange={(v) => setCamera({ fov: v })} />
    </div>
  );
}
