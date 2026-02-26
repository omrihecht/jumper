import { Link } from 'react-router-dom';
import { useEffect } from 'react';

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      run: (opts?: { nodes?: NodeListOf<Element> }) => void;
    };
  }
}

const MERMAID_CONFIG = {
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#0d2d3a',
    primaryTextColor: '#e0e0e0',
    primaryBorderColor: '#00e5ff',
    lineColor: '#00e5ff88',
    secondaryColor: '#1a0d2e',
    tertiaryColor: '#0d0d0d',
    background: '#161616',
    mainBkg: '#0d2d3a',
    nodeBorder: '#00e5ff',
    clusterBkg: '#111111',
    clusterBorder: '#2a2a2a',
    titleColor: '#00e5ff',
    edgeLabelBackground: '#0d0d0d',
    textColor: '#e0e0e0',
    labelTextColor: '#cccccc',
    actorTextColor: '#e0e0e0',
    actorBkg: '#0d2d3a',
    actorBorder: '#00e5ff',
    signalColor: '#00e5ff',
    noteBkgColor: '#1a1a1a',
    noteTextColor: '#e0e0e0',
    noteBorderColor: '#333',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  flowchart: { curve: 'basis', padding: 20 },
  stateDiagram: { padding: 60 },
};

export function DocsPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = () => {
      window.mermaid?.initialize(MERMAID_CONFIG);
      window.mermaid?.run();
    };
    document.body.appendChild(script);
    return () => {
      script.parentNode?.removeChild(script);
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
          <p style={descStyle}>
            How input propagates through systems, state, and rendering layers.
            Dashed lines indicate reads via <code style={inlineCodeStyle}>getState()</code> (no React subscription).
          </p>
          <figure style={figureStyle}>
            <div className="mermaid" style={diagramStyle}>{`
flowchart TD
    subgraph input ["🎮 Input Layer"]
        Keyboard["⌨️ Keyboard Events"]
        Touch["👆 Touch Events"]
    end

    subgraph systems ["⚙️ Systems — Custom Hooks"]
        PlayerCtrl[usePlayerController]
        JumpPhys[useJumpPhysics]
        PlayerReset[usePlayerReset]
        WaveAnim[useWaveAnimation]
        Lifecycle[useBrickLifecycle]
        Collision[useCollisionDetection]
        GameLoop[useGameLoop]
    end

    subgraph state ["💾 State — Zustand"]
        Store["gameStore"]
    end

    subgraph rendering ["🖼️ Rendering — R3F"]
        Player[Player]
        BrickSea[BrickSea]
        Camera[GameCamera]
        Env[Environment]
        UI[HUD / Menus]
    end

    Keyboard --> PlayerCtrl
    Touch --> PlayerCtrl
    PlayerCtrl -.->|mutate in-place| Store
    Store -.->|getState| JumpPhys
    Store -.->|getState| WaveAnim
    JumpPhys --> Store
    WaveAnim --> BrickSea
    Lifecycle --> BrickSea
    Collision --> Store
    PlayerReset -.->|getState| Store
    GameLoop --> Collision
    Store --> Player
    Store --> Camera
    Store --> UI
            `}</div>
            <figcaption style={captionStyle}>Input → Systems → State → Rendering pipeline</figcaption>
          </figure>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Game State Machine</h2>
          <p style={descStyle}>
            Route transitions shown alongside state changes. The Zustand <code style={inlineCodeStyle}>phase</code> drives
            in-game sub-states while React Router handles top-level screen navigation.
          </p>
          <figure style={figureStyle}>
            <div className="mermaid" style={stateDiagramStyle}>{`
stateDiagram-v2
    [*] --> Menu: /
    Menu --> Playing: Start Game → /play
    Playing --> Paused: Escape
    Paused --> Playing: Resume
    Paused --> Menu: Quit → /
    Playing --> LevelUp: Reach End (not final, +1 life)
    LevelUp --> Playing: Auto-advance (2s)
    Playing --> Won: Final level (+1 life) → /you-win
    Playing --> Playing: Fall (lives > 0, respawn)
    Playing --> Lost: Fall (lives = 0) → /game-over
    Won --> Menu: Play Again → /
    Lost --> Menu: Play Again → /
            `}</div>
            <figcaption style={captionStyle}>Phase transitions and their corresponding routes</figcaption>
          </figure>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>State Management</h2>
          <p style={descStyle}>
            Game state is managed by a single Zustand store (<code style={inlineCodeStyle}>gameStore</code>).
            Screen-level navigation is handled by React Router, while in-game sub-states
            are driven by the store's <code style={inlineCodeStyle}>phase</code> field.
          </p>

          <h3 style={h3Style}>Store Shape</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Field</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['phase', "'idle' | 'playing' | 'paused' | 'level_up'", 'Current in-game phase'],
                ['currentScreen', "'menu' | 'play' | 'game-over' | 'you-win'", 'Active 3D scene (drives SceneSwitch)'],
                ['score', 'number', 'Accumulated points'],
                ['lives', 'number', 'Remaining lives (starts at 3)'],
                ['elapsedTime', 'number', 'Seconds since game start'],
                ['levelIndex', 'number', 'Current level (0-based)'],
                ['currentLevel', 'LevelConfig', 'Active level configuration'],
                ['player', '{ position, isGrounded, isJumping }', 'Player runtime state'],
                ['resetCount', 'number', 'Increments on respawn (signals systems)'],
              ].map(([field, type, purpose]) => (
                <tr key={field}>
                  <td style={tdKeyStyle}>{field}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 13 }}>{type}</td>
                  <td style={tdStyle}>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={h3Style}>Dual Routing Strategy</h3>
          <div style={gridStyle}>
            {[
              ['React Router', 'Top-level screens (menu, play, game-over, you-win). URL-driven, supports refresh and deep-linking.'],
              ['Zustand phase', 'In-game sub-states (playing, paused, level_up). Drives HUD, pause menu, and level-up overlay within the /play route.'],
              ['useScreenSync', 'Hook that syncs the mounted route to currentScreen on mount, so SceneSwitch renders the correct 3D scene after a page refresh.'],
              ['navigateTo()', 'Imperative navigation for R3F hooks (e.g. collision handlers) that live outside the React Router tree.'],
            ].map(([name, desc]) => (
              <div key={name} style={cardStyle}>
                <strong style={cardTitleStyle}>{name}</strong>
                <span style={cardDescStyle}>{desc}</span>
              </div>
            ))}
          </div>

          <h3 style={h3Style}>Access Patterns</h3>
          <ul style={listStyle}>
            <li><strong>UI components</strong> — Use selector hooks (<code style={inlineCodeStyle}>useGameStore(s =&gt; s.score)</code>) to subscribe and re-render on change.</li>
            <li><strong>useFrame loops</strong> — Use <code style={inlineCodeStyle}>useGameStore.getState()</code> to read without creating subscriptions (avoids 60fps re-renders across all bricks).</li>
            <li><strong>Event handlers</strong> — Use <code style={inlineCodeStyle}>useGameStore.getState().actionName()</code> for fire-and-forget mutations (e.g. collision callbacks).</li>
            <li><strong>Player position</strong> — Mutated in-place (never triggers <code style={inlineCodeStyle}>set()</code>) since no component subscribes to it.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Lives & Respawn</h2>
          <ul style={listStyle}>
            <li>Player starts with <strong>3 lives</strong> (4 total attempts)</li>
            <li>Falling below the death plane costs 1 life and triggers a respawn</li>
            <li>Game over only when falling with <strong>0 lives</strong> remaining</li>
            <li>Winning a level grants <strong>+1 life</strong></li>
            <li>Respawn uses a <code>resetCount</code> signal — Player teleports rigid body to start, Camera snaps to initial view</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Directory Structure</h2>
          <pre style={codeStyle}>{`src/game/
├── GameLayout.tsx               # Shared Canvas + Physics layout (all routes)
├── navigation.ts                # Imperative navigate for R3F hooks
├── screens/
│   ├── MenuScreen.tsx           # Start screen overlay
│   ├── PlayScreen.tsx           # Gameplay UI (HUD, pause, level-up)
│   ├── GameOverScreen.tsx       # Game over overlay
│   └── YouWinScreen.tsx         # Victory overlay
├── scenes/
│   ├── SceneSwitch.tsx          # Renders scene by currentScreen
│   ├── GameScene.tsx            # Gameplay scene graph
│   ├── MenuScene.tsx            # Start screen backdrop
│   ├── GameOverScene.tsx        # Lose screen backdrop
│   └── YouWinScene.tsx          # Win screen backdrop + confetti
├── entities/
│   ├── Player.tsx               # Player cube (delegates to 4 hooks)
│   ├── Brick.tsx                # Brick — React.memo, no re-renders after mount
│   ├── BrickSea.tsx             # Grid manager
│   ├── StartPlatform.tsx        # Spawn platform (shadow + translucent)
│   ├── EndPlatform.tsx          # Goal platform (triggers win/level-up)
│   ├── ShadowGroup.tsx          # Shared-geometry shadow planes
│   └── platformMaterials.ts     # Shared platform edge material
├── systems/
│   ├── usePlayerController.ts   # Keyboard → velocity (mutates pos in-place)
│   ├── useJumpPhysics.ts        # Jump + coyote time + input buffer
│   ├── usePlayerReset.ts        # Respawn teleport on resetCount change
│   ├── useWaveAnimation.ts      # Per-brick sine wave
│   ├── useBrickLifecycle.ts     # Brick scale/fade/vanish + material mgmt
│   ├── useBrickShadow.ts        # Player proximity shadow on bricks
│   ├── useBrickHitGlow.ts       # Collision tracking via ref (no state)
│   ├── useCollisionDetection.ts # Death plane check (single-trigger guard)
│   └── useGameLoop.ts           # Frame tick coordinator
├── state/
│   ├── gameStore.ts             # Zustand store (lives, respawn, phase)
│   ├── types.ts                 # TypeScript interfaces
│   └── useScreenSync.ts         # Route → currentScreen sync hook
├── config/
│   ├── gameConfig.ts            # Physics, movement, camera, lighting
│   ├── levelConfig.ts           # Level definitions (3 levels)
│   └── controls.ts              # Key bindings
├── camera/
│   ├── AutoPanCamera.tsx        # Orbiting camera for non-gameplay screens
│   ├── GameCamera.tsx           # OrbitControls + Z follow + respawn reset
│   ├── useCameraDebugTracking.ts # Debug coord updates (change-gated)
│   └── cameraDebugStore.ts      # Debug coord store
├── environment/
│   ├── Lighting.tsx             # Scene lights (from config)
│   ├── Sky.tsx                  # Background color (from config)
│   ├── Starfield.tsx            # 3D starfield (Points on sphere shell)
│   ├── Confetti.tsx             # Falling confetti particles (win screen)
│   └── LevelTitle.tsx           # 3D floating level name
├── ui/
│   ├── HUD.tsx                  # Score, lives, timer
│   ├── PauseMenu.tsx            # Pause overlay
│   ├── LevelUpOverlay.tsx       # Level-up transition (2s auto-advance)
│   └── styles.ts                # Shared overlay/button styles
└── dev/
    ├── devStore.ts              # Runtime config store
    ├── DevPanel.tsx             # Collapsible debug panel
    ├── PhysicsControls.tsx      # Physics sliders
    ├── CameraControls.tsx       # Camera sliders
    ├── Slider.tsx               # Reusable slider
    ├── styles.ts                # Shared dev panel styles
    ├── useDevGravity.ts         # Runtime gravity sync
    └── useDevDamping.ts         # Runtime damping sync`}</pre>
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
              ['Bricks (base)', '#8a8a8a', '#8a8a8a'],
              ['Bricks (hit)', 'random neon', '#ff00ff'],
              ['Player', '#00e5ff', '#00e5ff'],
              ['Start Platform', '#39ff14', '#39ff14'],
              ['End Platform', '#ff355e', '#ff355e'],
            ].map(([label, color, bg]) => (
              <div key={label} style={{ ...cardStyle, borderLeft: `4px solid ${bg}` }}>
                <div style={colorSwatchRowStyle}>
                  <div style={{ ...colorSwatchStyle, background: bg, boxShadow: `0 0 8px ${bg}` }} />
                  <strong style={cardTitleStyle}>{label}</strong>
                </div>
                <code style={colorCodeStyle}>{color}</code>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Performance Pitfalls</h2>
          <p style={descStyle}>
            React Three Fiber apps must carefully manage when React reconciliation runs vs. when Three.js objects
            are updated imperatively. Here are the rules this codebase follows:
          </p>
          <ul style={listStyle}>
            <li><strong>useFrame reads via getState()</strong> — Never use Zustand selector hooks inside useFrame callbacks. Selectors create React subscriptions; multiplied across 40+ bricks, each state change triggers mass re-renders.</li>
            <li><strong>Refs over useState for visuals</strong> — Collision-driven effects (hit glow color) use <code>useRef</code> instead of <code>useState</code>. Material properties are set imperatively by <code>useBrickLifecycle</code>, so Brick components never re-render after mount.</li>
            <li><strong>Mutate position in-place</strong> — Player position is written 60x/sec but no React component subscribes to it. The array is mutated directly, bypassing <code>set()</code> entirely.</li>
            <li><strong>Throttle store updates</strong> — <code>elapsedTime</code> only triggers <code>set()</code> when the displayed value (0.1s precision) changes. Camera debug coordinates only update when rounded values differ.</li>
            <li><strong>Guard boolean setters</strong> — <code>setPlayerGrounded</code> and <code>setPlayerJumping</code> check the current value before calling <code>set()</code> to skip no-op updates.</li>
            <li><strong>Static Canvas/Physics props</strong> — <code>GameLayout.tsx</code> uses config constants (not store subscriptions) for initial camera FOV and physics gravity. Runtime changes are synced by child hooks (<code>useDevGravity</code>, <code>useDevDamping</code>, FOV sync in GameCamera).</li>
            <li><strong>Share geometry</strong> — Identical geometries (shadow planes) are hoisted to module scope and shared across all instances. Per-instance materials only when opacity varies independently.</li>
          </ul>
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

const h3Style: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  color: '#b0bec5',
  margin: '28px 0 12px',
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

const figureStyle: React.CSSProperties = {
  margin: '16px 0 0',
};

const captionStyle: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12,
  color: '#666',
  fontStyle: 'italic',
  textAlign: 'center',
};

const inlineCodeStyle: React.CSSProperties = {
  background: '#1e1e1e',
  padding: '2px 6px',
  borderRadius: 4,
  fontSize: '0.9em',
  color: '#00e5ff',
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
};

const diagramStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, #111111, #161616)',
  border: '1px solid #1e3a4a',
  borderRadius: 12,
  padding: '32px 24px',
  textAlign: 'center',
  overflow: 'auto',
  boxShadow: '0 0 20px rgba(0,229,255,0.05), inset 0 1px 0 rgba(255,255,255,0.03)',
};

const stateDiagramStyle: React.CSSProperties = {
  ...diagramStyle,
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

const colorSwatchRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const colorSwatchStyle: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: 4,
};

const colorCodeStyle: React.CSSProperties = {
  color: '#888',
  fontSize: 13,
};
