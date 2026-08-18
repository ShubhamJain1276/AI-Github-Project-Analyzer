import { useEffect, useRef, useCallback } from 'react';

export default function InteractiveBg({ className = '' }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animFrame = useRef(null);
  const dotsRef = useRef([]);

  const COLS = 28;
  const ROWS = 18;
  const RADIUS = 1.6;
  const HOVER_RADIUS = 120;
  const MAX_LIFT = 10;

  const initDots = useCallback((w, h) => {
    const dots = [];
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        dots.push({
          baseX: (c / COLS) * w,
          baseY: (r / ROWS) * h,
          x: (c / COLS) * w,
          y: (r / ROWS) * h,
          vx: 0,
          vy: 0,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.parentElement.offsetWidth;
    let h = canvas.parentElement.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    initDots(w, h);

    const onResize = () => {
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      initDots(w, h);
    };
    window.addEventListener('resize', onResize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const SPRING = 0.06;
    const DAMPEN = 0.82;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const dots = dotsRef.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.baseX - mx;
        const dy = d.baseY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / HOVER_RADIUS);

        // push away from cursor
        const pushX = influence * (dx / (dist || 1)) * MAX_LIFT;
        const pushY = influence * (dy / (dist || 1)) * MAX_LIFT;

        d.vx += ((d.baseX + pushX) - d.x) * SPRING;
        d.vy += ((d.baseY + pushY) - d.y) * SPRING;
        d.vx *= DAMPEN;
        d.vy *= DAMPEN;
        d.x += d.vx;
        d.y += d.vy;

        const r = RADIUS + influence * 2.5;
        const alpha = 0.18 + influence * 0.55;

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fill();
      }

      animFrame.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [initDots]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
