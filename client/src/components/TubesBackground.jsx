import React from 'react';

export function TubesBackground({ children, style = {} }) {
  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
        ...style
      }}
    >
      {/* Top Left Glowing Orb */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        border: '2px solid rgba(99, 102, 241, 0.3)',
        boxShadow: 'inset -30px -30px 80px rgba(139, 92, 246, 0.15), 0 0 100px rgba(99, 102, 241, 0.15)',
        background: 'transparent',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Bottom Right Glowing Orb */}
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        right: '-15%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        border: '2px solid rgba(6, 182, 212, 0.3)',
        boxShadow: 'inset 30px 30px 80px rgba(6, 182, 212, 0.1), 0 0 120px rgba(6, 182, 212, 0.1)',
        background: 'transparent',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Dotted Pattern Top Right */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '5%',
        width: '400px',
        height: '400px',
        opacity: 0.3,
        backgroundImage: 'radial-gradient(var(--text-muted) 2px, transparent 2px)',
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)',
        WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Dotted Pattern Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: '0%',
        left: '5%',
        width: '400px',
        height: '400px',
        opacity: 0.3,
        backgroundImage: 'radial-gradient(var(--text-muted) 2px, transparent 2px)',
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)',
        WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />



      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%'
      }}>
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
