import { useState } from 'react';
import { PhysicsControls } from './PhysicsControls';
import { CameraControls } from './CameraControls';
import { useDevStore } from './devStore';
import type { CSSProperties } from 'react';

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const resetAll = useDevStore((s) => s.resetAll);

  return (
    <div style={containerStyle}>
      <button onClick={() => setOpen((o) => !o)} style={toggleStyle}>
        {open ? '▼ Dev' : '► Dev'}
      </button>
      {open && (
        <div style={panelStyle}>
          <PhysicsControls />
          <CameraControls />
          <button onClick={resetAll} style={resetStyle}>
            Reset All
          </button>
          <a href="/jumper/docs" style={docsLinkStyle}>
            Docs
          </a>
        </div>
      )}
    </div>
  );
}

const containerStyle: CSSProperties = {
  position: 'fixed',
  bottom: 16,
  left: 16,
  zIndex: 1000,
  pointerEvents: 'auto',
};

const toggleStyle: CSSProperties = {
  background: 'rgba(0,0,0,0.8)',
  color: '#00e5ff',
  border: '1px solid #333',
  borderRadius: 6,
  padding: '6px 14px',
  fontSize: 13,
  fontFamily: 'monospace',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const panelStyle: CSSProperties = {
  background: 'rgba(0,0,0,0.85)',
  border: '1px solid #333',
  borderRadius: 8,
  padding: 12,
  marginTop: 6,
  width: 320,
  maxHeight: '60vh',
  overflowY: 'auto',
  fontFamily: 'monospace',
};

const resetStyle: CSSProperties = {
  marginTop: 12,
  width: '100%',
  padding: '8px 0',
  background: '#333',
  color: '#ff355e',
  border: '1px solid #555',
  borderRadius: 6,
  fontSize: 13,
  fontFamily: 'monospace',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const docsLinkStyle: CSSProperties = {
  display: 'block',
  marginTop: 8,
  color: '#00e5ff',
  fontSize: 12,
  fontFamily: 'monospace',
  textDecoration: 'none',
  opacity: 0.7,
};
