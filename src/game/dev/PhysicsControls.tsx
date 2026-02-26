import { useDevStore } from './devStore';
import { Slider } from './Slider';
import { sectionHeaderStyle } from './styles';

export function PhysicsControls() {
  const physics = useDevStore((s) => s.physics);
  const movement = useDevStore((s) => s.movement);
  const jump = useDevStore((s) => s.jump);
  const setPhysics = useDevStore((s) => s.setPhysics);
  const setMovement = useDevStore((s) => s.setMovement);
  const setJump = useDevStore((s) => s.setJump);

  return (
    <div>
      <div style={sectionHeaderStyle}>Physics</div>
      <Slider label="Gravity" value={physics.gravity} min={-100} max={-5} step={1} onChange={(v) => setPhysics({ gravity: v })} />
      <Slider label="Lin. Damping" value={physics.playerLinearDamping} min={0} max={10} step={0.1} onChange={(v) => setPhysics({ playerLinearDamping: v })} />

      <div style={sectionHeaderStyle}>Movement</div>
      <Slider label="Speed" value={movement.speed} min={1} max={20} step={0.5} onChange={(v) => setMovement({ speed: v })} />
      <Slider label="Sprint Mult." value={movement.sprintMultiplier} min={1} max={3} step={0.1} onChange={(v) => setMovement({ sprintMultiplier: v })} />

      <div style={sectionHeaderStyle}>Jump</div>
      <Slider label="Force" value={jump.force} min={5} max={60} step={1} onChange={(v) => setJump({ force: v })} />
      <Slider label="Cooldown" value={jump.cooldown} min={0.01} max={0.5} step={0.01} onChange={(v) => setJump({ cooldown: v })} />
    </div>
  );
}
