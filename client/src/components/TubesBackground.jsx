import React, { useEffect, useRef, useState } from 'react';

// Helper for random colors
const randomColors = (count) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

export function TubesBackground({ 
  children, 
  style = {},
  enableClickInteraction = true 
}) {
  const canvasRef = useRef(null);
  const tubesRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    let cleanup;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        const module = await import(
          /* @vite-ignore */
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#6366f1", "#06b6d4", "#8b5cf6"],
            lights: {
              intensity: 200,
              colors: ["#6366f1", "#06b6d4", "#f59e0b", "#ec4899"]
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {};
        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    
    tubesRef.current.tubes.setColors(colors);
    tubesRef.current.tubes.setLightsColors(lightsColors);
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        ...style
      }}
      onClick={handleClick}
    >
      {/* WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none'
        }}
      />
      
      {/* Subtle gradient overlay for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Content Overlay */}
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
