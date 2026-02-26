import { useState } from 'react';
import { PhysicsControls } from './PhysicsControls';
import { CameraControls } from './CameraControls';
import { useDevStore } from './devStore';
import s from './dev.module.scss';

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const resetAll = useDevStore((s) => s.resetAll);

  return (
    <div className={s.container}>
      <button onClick={() => setOpen((o) => !o)} className={s.toggle}>
        {open ? '▼ Dev' : '► Dev'}
      </button>
      {open && (
        <div className={s.panel}>
          <PhysicsControls />
          <CameraControls />
          <button onClick={resetAll} className={s.reset}>
            Reset All
          </button>
          <a href="/jumper/docs" className={s.docsLink}>
            Docs
          </a>
        </div>
      )}
    </div>
  );
}
