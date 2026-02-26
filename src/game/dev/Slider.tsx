import type { CSSProperties } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 4,
};

const labelStyle: CSSProperties = {
  width: 110,
  fontSize: 12,
  color: '#ccc',
  flexShrink: 0,
};

const valueStyle: CSSProperties = {
  width: 50,
  fontSize: 12,
  color: '#fff',
  textAlign: 'right',
  flexShrink: 0,
};

export function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor: '#00e5ff' }}
      />
      <span style={valueStyle}>{value.toFixed(step < 1 ? 2 : 0)}</span>
    </div>
  );
}
