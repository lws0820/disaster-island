import { useRef } from 'react';
import { MODES, MODE_ORDER } from '../state/modes.js';

// Drawing space for the SVG layers; the pad itself is 144px (mobile) / 176px (sm+).
const VB = 300;
const C = VB / 2;
const NOTCH_R = 96; // radius of the three mode buttons, in drawing units

// Point on a circle, 0deg = top, clockwise.
const polar = (r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return [C + r * Math.sin(rad), C - r * Math.cos(rad)];
};

// Orange wedge that sits behind the active notch (drawn pointing up, then rotated).
const wedge = (() => {
  const [x1, y1] = polar(50, -34);
  const [x2, y2] = polar(146, -34);
  const [x3, y3] = polar(146, 34);
  const [x4, y4] = polar(50, 34);
  return `M ${x1} ${y1} L ${x2} ${y2} A 146 146 0 0 1 ${x3} ${y3} L ${x4} ${y4} A 50 50 0 0 0 ${x1} ${y1} Z`;
})();

const ticks = Array.from({ length: 60 }, (_, i) => i * 6);

// `alertCounts`: elements each mode puts on alert, shown as a badge on its notch.
export default function CompassPanel({ currentMode: mode, onChange, alertCounts = {} }) {
  const active = MODES[mode];

  // Keep a running rotation so the dial always turns the short way
  // (e.g. 240deg -> 0deg goes +120deg instead of spinning back -240deg).
  const rotation = useRef(active.angle);
  const current = ((rotation.current % 360) + 360) % 360;
  rotation.current += ((active.angle - current + 540) % 360) - 180;
  const rot = rotation.current;

  return (
    <div
      className="relative h-36 w-36 select-none sm:h-44 sm:w-44"
      data-testid="compass"
      data-mode={mode}
      data-rotation={rot}
    >
      {/* Pulsing orange rings: two staggered so there is always one expanding */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-pad-ring rounded-full border-2 border-rescue" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-pad-ring rounded-full border-2 border-rescue [animation-delay:1.2s]" />

      {/* Static face */}
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="absolute inset-0 h-full w-full rounded-full shadow-[0_0_28px_rgba(217,107,39,0.45),0_14px_36px_rgba(0,0,0,0.6)]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="pad-face" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#30497A" />
            <stop offset="100%" stopColor="#0F1B33" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={147} fill="url(#pad-face)" stroke="#D96B27" strokeWidth="5" />
        {ticks.map((deg) => {
          const major = deg % 120 === 0;
          const [x1, y1] = polar(144, deg);
          const [x2, y2] = polar(major ? 128 : 137, deg);
          return (
            <line
              key={deg}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={major ? '#D96B27' : '#6F86B3'}
              strokeWidth={major ? 5 : 2}
              strokeOpacity={major ? 1 : 0.5}
            />
          );
        })}
      </svg>

      {/* Rotating wedge + rim marker: locks onto the active notch */}
      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-1000 ease-lock"
        style={{ transform: `rotate(${rot}deg)` }}
        data-testid="compass-rotor"
      >
        <svg viewBox={`0 0 ${VB} ${VB}`} className="h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id="pad-wedge" cx="50%" cy="50%" r="50%">
              <stop offset="30%" stopColor="#D96B27" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#D96B27" stopOpacity="0.55" />
            </radialGradient>
          </defs>
          <path d={wedge} fill="url(#pad-wedge)" />
          <polygon points={`${C - 13},0 ${C + 13},0 ${C},22`} fill="#F08A4B" />
          <circle cx={C} cy={C} r={50} fill="none" stroke="#D96B27" strokeWidth="3" strokeDasharray="22 10 4 10" />
        </svg>
      </div>

      {/* Center hub */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-rescue bg-civil-900 sm:h-14 sm:w-14">
        <span key={mode} className="text-xs font-extrabold leading-none text-white sm:text-sm" style={{ animation: 'flow-in 0.4s ease-out' }}>
          {active.zh}
        </span>
        <span className="mt-0.5 hidden text-[7px] font-bold uppercase tracking-wider text-rescue-400 sm:block">TCDRA</span>
      </div>

      {/* Mode notches: 40px / 48px tap targets */}
      {MODE_ORDER.map((id, i) => {
        const m = MODES[id];
        const [x, y] = polar(NOTCH_R, m.angle);
        const on = id === mode;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={on}
            aria-label={`${m.en} mode (${m.zh})`}
            title={`${m.en} (${i + 1})`}
            data-testid={`mode-${id}`}
            className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-[transform,background-color,border-color,color,box-shadow] duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-rescue-400/60 active:scale-95 sm:h-12 sm:w-12 sm:text-xs ${
              on
                ? 'scale-110 border-white/80 bg-rescue text-white shadow-[0_0_18px_rgba(217,107,39,0.9)]'
                : 'border-civil-400/60 bg-civil-800 text-civil-400 hover:border-rescue hover:text-white'
            }`}
            style={{ left: `${(x / VB) * 100}%`, top: `${(y / VB) * 100}%` }}
          >
            {m.zh}
            {alertCounts[id] > 0 && (
              <span
                className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-extrabold ${on ? 'bg-white text-rescue' : 'bg-rescue text-white'}`}
                aria-label={`${alertCounts[id]} alerts`}
                data-testid={`badge-${id}`}
              >
                {alertCounts[id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
