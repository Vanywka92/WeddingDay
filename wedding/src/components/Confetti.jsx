import { useEffect, useRef } from 'react';

const COLORS = [
  '#c8a96e', '#ecdfc8', '#ffd700',
  '#ffffff', '#a8893e', '#f4ede3',
  '#e8c87a', '#d4b483',
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export default function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 90 }, () => ({
      x:     rand(0, canvas.width),
      y:     rand(-canvas.height * 0.6, -10),
      w:     rand(5, 11),
      h:     rand(3, 7),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:    rand(-2.5, 2.5),
      vy:    rand(2.5, 6),
      rot:   rand(0, Math.PI * 2),
      rotV:  rand(-0.12, 0.12),
    }));

    let rafId;
    let stopped = false;

    const draw = () => {
      if (stopped) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allGone = true;
      for (const p of pieces) {
        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.rotV;
        p.vy  += 0.06;

        if (p.y < canvas.height + 30) allGone = false;

        const fade = Math.max(0, 1 - p.y / (canvas.height * 1.1));
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (!allGone) {
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        pointerEvents: 'none',
      }}
    />
  );
}
