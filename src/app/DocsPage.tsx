import { Link } from 'react-router-dom';
import { useEffect } from 'react';

declare global {
  interface Window {
    mermaid?: { run: (opts?: { nodes?: NodeListOf<Element> }) => void };
  }
}

export function DocsPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = () => {
      window.mermaid?.run();
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Play Game</Link>
        <span style={titleStyle}>Jumper — Architecture Docs</span>
      </nav>

      <main style={mainStyle}>
        <section style={sectionStyle}>
          <h1 style={h1Style}>Jumper Game Architecture</h1>
          <p style={descStyle}>
            A third-person 3D platformer where the player jumps across a sea of sine-wave-oscillating bricks
            to reach the end platform. Built with React Three Fiber on React 19 + Vite + TypeScript.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Tech Stack</h2>
          <div style={gridStyle}>
            {[
              ['React Three Fiber', 'React renderer for Three.js — declarative 3D scene graph'],
              ['@react-three/drei', 'Utility helpers: camera controls, text, shaders'],
              ['@react-three/rapier', 'Rust-based physics engine compiled to WASM'],
              ['Zustand', 'Lightweight state management for R3F integration'],
              ['Vite 7 + TypeScript', 'Fast dev server with full type safety'],
              ['Nx', 'Monorepo tooling and task orchestration'],
            ].map(([name, desc]) => (
              <div key={name} style={cardStyle}>
                <strong style={cardTitleStyle}>{name}</strong>
                <span style={cardDescStyle}>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Architecture Principles</h2>
          <ol style={listStyle}>
            <li><strong>Entities</strong> — React components rendering a single game object (mesh + rigid body)</li>
            <li><strong>Systems</strong> — Custom hooks encapsulating one slice of game logic (input, physics, animation)</li>
            <li><strong>State</strong> — Zustand store, decoupled from rendering</li>
            <li><strong>Config</strong> — All tunable parameters in dedicated files, no magic numbers in logic</li>
          </ol>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Data Flow</h2>
          <div className="mermaid" style={diagramStyle}>{`
flowchart TD
    subgraph input [Input Layer]
        Keyboard[Keyboard Events]
        Touch[Touch Events]
    end

    subgraph systems [Systems - Custom Hooks]
        PlayerCtrl[usePlayerController]
        JumpPhys[useJumpPhysics]
        WaveAnim[useWaveAnimation]
        Collision[useCollisionDetection]
        GameLoop[useGameLoop]
    end

    subgraph state [State - Zustand]
        Store["gameStore"]
    end

    subgraph rendering [Rendering - R3F Components]
        Player[Player]
        BrickSea[BrickSea]
        Camera[GameCamera]
        Env[Environment]
        UI[HUD / Menus]
    end

    Keyboard --> PlayerCtrl
    Touch --> PlayerCtrl
    PlayerCtrl --> Store
    Store --> JumpPhys
    Store --> WaveAnim
    JumpPhys --> Store
    WaveAnim --> BrickSea
    Collision --> Store
    GameLoop --> PlayerCtrl
    GameLoop --> JumpPhys
    GameLoop --> WaveAnim
    GameLoop --> Collision
    Store --> Player
    Store --> Camera
    Store --> UI
          `}</div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Game State Machine</h2>
          <div className="mermaid" style={diagramStyle}>{`
stateDiagram-v2
    [*] --> Menu
    Menu --> Playing: Start Game
    Playing --> Paused: Pause
    Paused --> Playing: Resume
    Playing --> Won: Reach End Platform
    Playing --> Lost: Fall Off
    Won --> Menu: Play Again
    Lost --> Menu: Try Again
          `}</div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Directory Structure</h2>
          <pre style={codeStyle}>{`src/game/
├── Game.tsx                     # R3F Canvas + Physics wrapper
├── scenes/
│   ├── GameScene.tsx            # Gameplay scene graph
│   ├── MenuScene.tsx            # Start screen
│   └── GameOverScene.tsx        # Win/lose screen
├── entities/
│   ├── Player.tsx               # Player mesh + rigid body
│   ├── Brick.tsx                # Oscillating brick (delegates to hooks)
│   ├── BrickSea.tsx             # Grid manager
│   ├── StartPlatform.tsx        # Spawn platform
│   └── EndPlatform.tsx          # Goal platform (triggers win)
├── systems/
│   ├── usePlayerController.ts   # Keyboard → velocity
│   ├── useJumpPhysics.ts        # Jump + coyote time + input buffer
│   ├── useWaveAnimation.ts      # Per-brick sine wave
│   ├── useBrickShadow.ts        # Player proximity shadow on bricks
│   ├── useBrickHitGlow.ts       # Neon glow on player contact
│   ├── useCollisionDetection.ts # Death plane check
│   └── useGameLoop.ts           # Frame tick coordinator
├── state/
│   ├── gameStore.ts             # Zustand store
│   └── types.ts                 # TypeScript interfaces
├── config/
│   ├── gameConfig.ts            # Physics, movement, camera, lighting
│   ├── levelConfig.ts           # Level definitions
│   └── controls.ts              # Key bindings
├── camera/
│   ├── GameCamera.tsx           # OrbitControls + Z follow
│   └── cameraDebugStore.ts      # Debug coord store
├── environment/
│   ├── Lighting.tsx             # Scene lights (from config)
│   └── Sky.tsx                  # Background color (from config)
├── ui/
│   ├── GameUI.tsx               # Phase-based UI router
│   ├── MenuOverlay.tsx          # Start screen overlay
│   ├── GameOverOverlay.tsx      # Win/lose overlay
│   ├── HUD.tsx                  # Score, lives, timer
│   └── PauseMenu.tsx            # Pause overlay
└── dev/
    ├── devStore.ts              # Runtime config store
    ├── DevPanel.tsx             # Collapsible debug panel
    ├── PhysicsControls.tsx      # Physics sliders
    ├── CameraControls.tsx       # Camera sliders
    ├── Slider.tsx               # Reusable slider
    ├── styles.ts                # Shared dev panel styles
    └── useDevGravity.ts         # Runtime gravity sync`}</pre>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Controls</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Key</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Arrows / WASD', 'Move (X/Z axes, normalized diagonal)'],
                ['Space', 'Jump (coyote time + input buffering)'],
                ['Shift', 'Sprint (1.4x speed)'],
                ['Escape', 'Pause / Resume'],
                ['Mouse drag', 'Orbit camera'],
                ['Scroll', 'Zoom'],
                ['Right-click drag', 'Pan camera'],
              ].map(([key, action]) => (
                <tr key={key}>
                  <td style={tdKeyStyle}>{key}</td>
                  <td style={tdStyle}>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Visual Theme</h2>
          <div style={gridStyle}>
            {[
              ['Background', '#1a1a1a', '#1a1a1a'],
              ['Bricks', '#ff8c00', '#ff8c00'],
              ['Player', '#00e5ff', '#00e5ff'],
              ['Start Platform', '#39ff14', '#39ff14'],
              ['End Platform', '#ff355e', '#ff355e'],
            ].map(([label, color, bg]) => (
              <div key={label} style={{ ...cardStyle, borderLeft: `4px solid ${bg}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: bg, boxShadow: `0 0 8px ${bg}` }} />
                  <strong style={cardTitleStyle}>{label}</strong>
                </div>
                <code style={{ color: '#888', fontSize: 13 }}>{color}</code>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Extensibility</h2>
          <ul style={listStyle}>
            <li><strong>New levels</strong> — Add entries to the <code>LEVELS</code> array in <code>levelConfig.ts</code></li>
            <li><strong>New entities</strong> — Create a component in <code>entities/</code>, wire into <code>GameScene.tsx</code></li>
            <li><strong>New mechanics</strong> — Add a system hook in <code>systems/</code>, register in <code>useGameLoop</code></li>
            <li><strong>Visual themes</strong> — Swap materials/textures in entity components</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0d0d0d',
  color: '#e0e0e0',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  padding: '16px 32px',
  borderBottom: '1px solid #222',
  position: 'sticky',
  top: 0,
  background: 'rgba(13,13,13,0.95)',
  backdropFilter: 'blur(8px)',
  zIndex: 10,
};

const linkStyle: React.CSSProperties = {
  color: '#00e5ff',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  padding: '6px 16px',
  border: '1px solid #00e5ff',
  borderRadius: 6,
};

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: '#fff',
};

const mainStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: '0 auto',
  padding: '40px 24px 80px',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 48,
};

const h1Style: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 800,
  color: '#fff',
  margin: '0 0 12px',
};

const h2Style: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: '#00e5ff',
  margin: '0 0 16px',
  paddingBottom: 8,
  borderBottom: '1px solid #222',
};

const descStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.6,
  color: '#aaa',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 12,
};

const cardStyle: React.CSSProperties = {
  background: '#161616',
  border: '1px solid #2a2a2a',
  borderRadius: 8,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const cardTitleStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: 14,
};

const cardDescStyle: React.CSSProperties = {
  color: '#888',
  fontSize: 13,
  lineHeight: 1.4,
};

const listStyle: React.CSSProperties = {
  paddingLeft: 20,
  lineHeight: 2,
  fontSize: 15,
};

const diagramStyle: React.CSSProperties = {
  background: '#161616',
  border: '1px solid #2a2a2a',
  borderRadius: 8,
  padding: 24,
  textAlign: 'center',
  overflow: 'auto',
};

const codeStyle: React.CSSProperties = {
  background: '#161616',
  border: '1px solid #2a2a2a',
  borderRadius: 8,
  padding: 20,
  fontSize: 13,
  lineHeight: 1.5,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  color: '#ccc',
  overflow: 'auto',
  display: 'block',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 16px',
  borderBottom: '2px solid #333',
  color: '#00e5ff',
  fontSize: 13,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 1,
};

const tdKeyStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderBottom: '1px solid #1e1e1e',
  fontFamily: 'monospace',
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
};

const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderBottom: '1px solid #1e1e1e',
  color: '#aaa',
  fontSize: 14,
};
