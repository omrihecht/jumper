import { useDevStore } from './devStore';
import { Slider } from './Slider';

export function CameraControls() {
  const camera = useDevStore((s) => s.camera);
  const setCamera = useDevStore((s) => s.setCamera);

  return (
    <div>
      <div style={headerStyle}>Camera</div>
      <Slider label="FOV" value={camera.fov} min={30} max={120} step={1} onChange={(v) => setCamera({ fov: v })} />
      <Slider label="Offset Y" value={camera.offsetY} min={1} max={40} step={0.5} onChange={(v) => setCamera({ offsetY: v })} />
      <Slider label="Offset Z" value={camera.offsetZ} min={1} max={40} step={0.5} onChange={(v) => setCamera({ offsetZ: v })} />
      <Slider label="LookAt Z" value={camera.lookAtZ} min={-60} max={0} step={1} onChange={(v) => setCamera({ lookAtZ: v })} />
      <Slider label="Smooth Spd" value={camera.smoothSpeed} min={1} max={20} step={0.5} onChange={(v) => setCamera({ smoothSpeed: v })} />
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 'bold',
  color: '#00e5ff',
  marginTop: 8,
  marginBottom: 4,
  borderBottom: '1px solid #333',
  paddingBottom: 2,
};
