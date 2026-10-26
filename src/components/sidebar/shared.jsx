import { useEffect, useState } from 'react';

// Staggered slide-in for sidebar cards; transform + opacity only.
export const slideIn = (i) => ({ animation: `card-in 520ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms both` });

// Counts from 0 to `value` on mount (cards remount on every mode switch).
export function CountUp({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      // rAF timestamps can be slightly earlier than t0, so clamp at 0 too.
      const p = Math.min(1, Math.max(0, (t - t0) / 800));
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return n.toLocaleString('en-US');
}

// Status pill. Baseline states use deep green / calm blue; alert states use rescue orange.
export function StateChip({ style }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ring-1 ${style.hot ? 'ring-rescue-400' : 'ring-white/20'}`}
      style={{ backgroundColor: style.bg }}
    >
      {style.hot && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white" />}
      {style.label}
    </span>
  );
}
