import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import s from './docs.module.scss';

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
    <div className={s.page}>
      <nav>
        <Link to="/">Play Game</Link>
        <span>Jumper — Architecture Docs</span>
      </nav>

      <main>
        <section>
          <h1>Jumper Game Architecture</h1>
          <p>
            A third-person 3D platformer where the player jumps across a sea of sine-wave-oscillating bricks
            to reach the end platform. Built with React Three Fiber on React 19 + Vite + TypeScript.
          </p>
        </section>

        <section>
          <h2>Tech Stack</h2>
          <div className={s.grid}>
            {[
              ['React Three Fiber', 'React renderer for Three.js — declarative 3D scene graph'],
              ['@react-three/drei', 'Utility helpers: camera controls, text, shaders'],
              ['@react-three/rapier', 'Rust-based physics engine compiled to WASM'],
              ['Zustand', 'Lightweight state management for R3F integration'],
              ['Vite 7 + TypeScript', 'Fast dev server with full type safety'],
              ['Nx', 'Monorepo tooling and task orchestration'],
            ].map(([name, desc]) => (
              <div key={name}>
                <strong>{name}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Architecture Principles</h2>
          <ol>
            <li><strong>Entities</strong> — React components rendering a single game object (mesh + rigid body)</li>
            <li><strong>Systems</strong> — Custom hooks encapsulating one slice of game logic (input, physics, animation)</li>
            <li><strong>State</strong> — Zustand store, decoupled from rendering</li>
            <li><strong>Config</strong> — All tunable parameters in dedicated files, no magic numbers in logic</li>
          </ol>
        </section>

        <section>
          <h2>Data Flow</h2>
          <p>
            How input propagates through systems, state, and rendering layers.
            Dashed lines indicate reads via <code>getState()</code> (no React subscription).
          </p>
          <figure>
            <div className={`mermaid ${s.diagram}`}>{`
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
            <figcaption>Input → Systems → State → Rendering pipeline</figcaption>
          </figure>
        </section>

        <section>
          <h2>Game State Machine</h2>
          <p>
            Route transitions shown alongside state changes. The Zustand <code>phase</code> drives
            in-game sub-states while React Router handles top-level screen navigation.
          </p>
          <figure>
            <div className={`mermaid ${s.diagram}`}>{`
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
            <figcaption>Phase transitions and their corresponding routes</figcaption>
          </figure>
        </section>

        <section>
          <h2>State Management</h2>
          <p>
            Game state is managed by a single Zustand store (<code>gameStore</code>).
            Screen-level navigation is handled by React Router, while in-game sub-states
            are driven by the store's <code>phase</code> field.
          </p>

          <h3>Store Shape</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Purpose</th>
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
                  <td>{field}</td>
                  <td className={s.mono}>{type}</td>
                  <td>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Dual Routing Strategy</h3>
          <div className={s.grid}>
            {[
              ['React Router', 'Top-level screens (menu, play, game-over, you-win). URL-driven, supports refresh and deep-linking.'],
              ['Zustand phase', 'In-game sub-states (playing, paused, level_up). Drives HUD, pause menu, and level-up overlay within the /play route.'],
              ['useScreenSync', 'Hook that syncs the mounted route to currentScreen on mount, so SceneSwitch renders the correct 3D scene after a page refresh.'],
              ['navigateTo()', 'Imperative navigation for R3F hooks (e.g. collision handlers) that live outside the React Router tree.'],
            ].map(([name, desc]) => (
              <div key={name}>
                <strong>{name}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>

          <h3>Access Patterns</h3>
          <ul>
            <li><strong>UI components</strong> — Use selector hooks (<code>useGameStore(s =&gt; s.score)</code>) to subscribe and re-render on change.</li>
            <li><strong>useFrame loops</strong> — Use <code>useGameStore.getState()</code> to read without creating subscriptions (avoids 60fps re-renders across all bricks).</li>
            <li><strong>Event handlers</strong> — Use <code>useGameStore.getState().actionName()</code> for fire-and-forget mutations (e.g. collision callbacks).</li>
            <li><strong>Player position</strong> — Mutated in-place (never triggers <code>set()</code>) since no component subscribes to it.</li>
          </ul>
        </section>

        <section>
          <h2>Lives & Respawn</h2>
          <ul>
            <li>Player starts with <strong>3 lives</strong> (4 total attempts)</li>
            <li>Falling below the death plane costs 1 life and triggers a respawn</li>
            <li>Game over only when falling with <strong>0 lives</strong> remaining</li>
            <li>Winning a level grants <strong>+1 life</strong></li>
            <li>Respawn uses a <code>resetCount</code> signal — Player teleports rigid body to start, Camera snaps to initial view</li>
          </ul>
        </section>

        <section>
          <h2>Directory Structure</h2>
          <pre>{`src/game/
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
│   ├── StartPlatform.tsx        # Cylindrical spawn platform (glowing)
│   ├── EndPlatform.tsx          # Cylindrical goal platform (triggers win/level-up)
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
│   └── ui.module.scss           # Shared UI styles (SCSS)
└── dev/
    ├── devStore.ts              # Runtime config store
    ├── DevPanel.tsx             # Collapsible debug panel
    ├── PhysicsControls.tsx      # Physics sliders
    ├── CameraControls.tsx       # Camera sliders
    ├── Slider.tsx               # Reusable slider
    ├── dev.module.scss          # Dev panel styles (SCSS)
    ├── useDevGravity.ts         # Runtime gravity sync
    └── useDevDamping.ts         # Runtime damping sync`}</pre>
        </section>

        <section>
          <h2>Controls</h2>
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
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
                  <td>{key}</td>
                  <td>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Visual Theme</h2>
          <div className={s.grid}>
            {[
              ['Background', '#1a1a1a', '#1a1a1a'],
              ['Bricks (base)', '#8a8a8a', '#8a8a8a'],
              ['Bricks (hit)', 'random neon', '#ff00ff'],
              ['Player', '#00e5ff', '#00e5ff'],
              ['Start Platform', '#00ffc8', '#00ffc8'],
              ['End Platform', '#ff66bb', '#ff66bb'],
            ].map(([label, color, bg]) => (
              <div key={label} style={{ borderLeft: `4px solid ${bg}` }}>
                <div className={s.swatchRow}>
                  <div className={s.swatch} style={{ background: bg, boxShadow: `0 0 8px ${bg}` }} />
                  <strong>{label}</strong>
                </div>
                <code>{color}</code>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Performance Pitfalls</h2>
          <p>
            React Three Fiber apps must carefully manage when React reconciliation runs vs. when Three.js objects
            are updated imperatively. Here are the rules this codebase follows:
          </p>
          <ul>
            <li><strong>useFrame reads via getState()</strong> — Never use Zustand selector hooks inside useFrame callbacks. Selectors create React subscriptions; multiplied across 300+ bricks, each state change triggers mass re-renders.</li>
            <li><strong>Refs over useState for visuals</strong> — Collision-driven effects (hit glow color) use <code>useRef</code> instead of <code>useState</code>. Material properties are set imperatively by <code>useBrickLifecycle</code>, so Brick components never re-render after mount.</li>
            <li><strong>Mutate position in-place</strong> — Player position is written 60x/sec but no React component subscribes to it. The array is mutated directly, bypassing <code>set()</code> entirely.</li>
            <li><strong>Throttle store updates</strong> — <code>elapsedTime</code> only triggers <code>set()</code> when the displayed value (0.1s precision) changes. Camera debug coordinates only update when rounded values differ.</li>
            <li><strong>Guard boolean setters</strong> — <code>setPlayerGrounded</code> and <code>setPlayerJumping</code> check the current value before calling <code>set()</code> to skip no-op updates.</li>
            <li><strong>Static Canvas/Physics props</strong> — <code>GameLayout.tsx</code> uses config constants (not store subscriptions) for initial camera FOV and physics gravity. Runtime changes are synced by child hooks (<code>useDevGravity</code>, <code>useDevDamping</code>, FOV sync in GameCamera).</li>
            <li><strong>Share geometry and materials</strong> — Identical geometries (shadow planes) and materials (brick edge lines) are hoisted to module scope and shared across all instances. Per-instance materials only when per-instance properties (e.g., opacity) vary independently.</li>
          </ul>
        </section>

        <section>
          <h2>Extensibility</h2>
          <ul>
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
