import s from './dev.module.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

export function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <div className={s.sliderRow}>
      <span className={s.sliderLabel}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={s.sliderInput}
      />
      <span className={s.sliderValue}>{value.toFixed(step < 1 ? 2 : 0)}</span>
    </div>
  );
}
