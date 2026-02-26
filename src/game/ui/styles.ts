import type { CSSProperties } from 'react';

export const overlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.35)',
  color: 'white',
  fontFamily: 'sans-serif',
  gap: 16,
};

export const headingStyle: CSSProperties = {
  fontSize: 56,
  margin: 0,
};

export const buttonStyle: CSSProperties = {
  padding: '12px 32px',
  fontSize: 20,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  background: '#4fc3f7',
  color: '#000',
  fontWeight: 'bold',
};

export const scoreTextStyle: CSSProperties = {
  fontSize: 24,
};

export const timeTextStyle: CSSProperties = {
  fontSize: 20,
};
