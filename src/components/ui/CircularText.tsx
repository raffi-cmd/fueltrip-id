import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CircularTextProps {
  text?: string;
  spinDuration?: number;
  radius?: number;
  className?: string;
}

export const CircularText: React.FC<CircularTextProps> = ({
  text = 'FUELTRIP ID • CALCULATOR & MUDIK • ',
  spinDuration = 20,
  radius = 56,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const letters = Array.from(text);

  useEffect(() => {
    if (!containerRef.current) return;
    tweenRef.current?.kill();

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return;
    }

    tweenRef.current = gsap.to(containerRef.current, {
      rotation: 360,
      duration: spinDuration,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [spinDuration, text]);

  const handleEnter = () => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;
    if (!tweenRef.current) return;
    gsap.to(tweenRef.current, { timeScale: 2.2, duration: 0.3 });
  };

  const handleLeave = () => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;
    if (!tweenRef.current) return;
    gsap.to(tweenRef.current, { timeScale: 1, duration: 0.3 });
  };

  return (
    <div className={`relative inline-block select-none cursor-pointer ${className}`}>
      {/* Center Icon Badge */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 z-10 pointer-events-none flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/20">
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2l2.4 6.2L21 11l-6 2.2L12 22l-2.4-6.2L3 11l6-2.2z" />
        </svg>
      </span>

      {/* Rotating Circular Letters */}
      <div
        ref={containerRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ width: radius * 2 + 20, height: radius * 2 + 20, position: 'relative' }}
      >
        {letters.map((letter, i) => {
          const angle = (360 / letters.length) * i;
          return (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(90deg)`,
                transformOrigin: '0 0',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                whiteSpace: 'pre',
                pointerEvents: 'none',
                zIndex: 3,
              }}
              className="text-emerald-300/80 uppercase"
            >
              {letter}
            </span>
          );
        })}
      </div>
    </div>
  );
};
