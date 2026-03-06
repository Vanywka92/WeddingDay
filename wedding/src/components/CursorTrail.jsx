import { useEffect } from 'react';

const isTouch = typeof window !== 'undefined'
  ? window.matchMedia('(hover: none) and (pointer: coarse)').matches
  : true;

const STYLE_ID = 'cursor-trail-style';

export default function CursorTrail() {
  useEffect(() => {
    if (isTouch) return;

    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement('style');
      s.id = STYLE_ID;
      s.textContent = `
        @keyframes sparkFade {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(0);   opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }

    let last = 0;

    const onMove = (e) => {
      const now = Date.now();
      if (now - last < 70) return;
      last = now;

      const size = 3 + Math.random() * 5;
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, #ecdfc8 0%, #c8a96e 100%);
        pointer-events: none;
        z-index: 99997;
        animation: sparkFade 0.65s ease forwards;
        will-change: transform, opacity;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 680);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return null;
}
