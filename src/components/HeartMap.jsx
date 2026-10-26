import { useCallback, useEffect, useRef } from 'react';

const W = 1000;
const H = 600;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 3;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Curved path between two module centers, bowed to one side.
function flowPath(a, b) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = 0.18 * len;
  const cx = mx - (dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return { d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`, lx: (mx + cx) / 2, ly: (my + cy) / 2 };
}

// Drag / pinch / wheel pan-zoom. Writes the transform straight to the DOM so
// moving the map never re-renders React.
function usePanZoom() {
  const viewportRef = useRef(null);
  const layerRef = useRef(null);
  const labelRef = useRef(null);
  const view = useRef({ x: 0, y: 0, s: 1 });
  const pointers = useRef(new Map());
  const pinch = useRef(null);

  const apply = useCallback((animate = false) => {
    const { x, y, s } = view.current;
    const el = layerRef.current;
    el.style.transition = animate ? 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    if (labelRef.current) labelRef.current.textContent = `${Math.round(s * 100)}%`;
  }, []);

  // Zoom by `factor` keeping the point (cx, cy) in the viewport still.
  const zoomAt = useCallback((cx, cy, factor, animate) => {
    const v = view.current;
    const s = clamp(v.s * factor, MIN_ZOOM, MAX_ZOOM);
    v.x = cx - (cx - v.x) * (s / v.s);
    v.y = cy - (cy - v.y) * (s / v.s);
    v.s = s;
    apply(animate);
  }, [apply]);

  const zoomCenter = (factor) => {
    const r = viewportRef.current.getBoundingClientRect();
    zoomAt(r.width / 2, r.height / 2, factor, true);
  };

  const reset = () => {
    view.current = { x: 0, y: 0, s: 1 };
    apply(true);
  };

  useEffect(() => {
    const vp = viewportRef.current;
    const local = (e) => {
      const r = vp.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const pinchState = () => {
      const [a, b] = [...pointers.current.values()];
      return { dist: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
    };

    const onWheel = (e) => {
      e.preventDefault();
      const p = local(e);
      zoomAt(p.x, p.y, Math.exp(-e.deltaY * 0.0015), false);
    };
    const onDown = (e) => {
      if (e.target.closest('button')) return;
      vp.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, local(e));
      if (pointers.current.size === 2) pinch.current = pinchState();
    };
    const onMove = (e) => {
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;
      const p = local(e);
      pointers.current.set(e.pointerId, p);
      if (pointers.current.size === 1) {
        view.current.x += p.x - prev.x;
        view.current.y += p.y - prev.y;
        apply(false);
      } else if (pointers.current.size === 2 && pinch.current) {
        const next = pinchState();
        view.current.x += next.mx - pinch.current.mx;
        view.current.y += next.my - pinch.current.my;
        zoomAt(next.mx, next.my, next.dist / (pinch.current.dist || 1), false);
        pinch.current = next;
      }
    };
    const onUp = (e) => {
      pointers.current.delete(e.pointerId);
      pinch.current = pointers.current.size === 2 ? pinchState() : null;
    };

    vp.addEventListener('wheel', onWheel, { passive: false });
    vp.addEventListener('pointerdown', onDown);
    vp.addEventListener('pointermove', onMove);
    vp.addEventListener('pointerup', onUp);
    vp.addEventListener('pointercancel', onUp);
    return () => {
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('pointerdown', onDown);
      vp.removeEventListener('pointermove', onMove);
      vp.removeEventListener('pointerup', onUp);
      vp.removeEventListener('pointercancel', onUp);
    };
  }, [apply, zoomAt]);

  return { viewportRef, layerRef, labelRef, zoomCenter, reset };
}

export default function HeartMap({ scenario }) {
  const { viewportRef, layerRef, labelRef, zoomCenter, reset } = usePanZoom();
  const modules = scenario.modules;
  const byKey = Object.fromEntries(modules.map((m) => [m.key, m]));
  const hot = scenario.alerts.length > 0;
  const lineColor = hot ? '#D96B27' : '#6F86B3';
  const radio = scenario.radioFrom ? byKey[scenario.radioFrom] : null;

  return (
    <>
      <div
        ref={viewportRef}
        onDoubleClick={reset}
        className="absolute inset-0 cursor-grab touch-none overflow-hidden active:cursor-grabbing"
        data-testid="map-viewport"
      >
        <div ref={layerRef} className="absolute inset-0 origin-top-left" data-testid="map-layer">
          {/* Leaves room for the header (top), sidebar (left, desktop) and compass (bottom/right). */}
          <div
            className="absolute inset-0 flex items-center justify-center px-4 pb-52 pt-24 lg:pb-12 lg:pl-[23rem] lg:pr-60 lg:pt-24"
            style={{ containerType: 'size' }}
          >
            <div
              className="relative rounded-2xl border border-civil-400/25 bg-civil-800/70 shadow-2xl"
              style={{ width: 'min(100cqw, calc(100cqh * 5 / 3))', aspectRatio: `${W} / ${H}`, containerType: 'inline-size' }}
              data-testid="heart-map"
            >
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#6F86B3" strokeOpacity="0.14" />
                  </pattern>
                </defs>
                <rect width={W} height={H} rx="16" fill="url(#grid)" />

                {/* Radio web (earthquake): rings broadcast from the comms module + links to every module */}
                {radio && (
                  <g key={`radio-${scenario.id}`} style={{ animation: 'flow-in 0.6s ease-out' }} data-testid="radio-web">
                    {modules.filter((m) => m.key !== radio.key).map((m) => (
                      <line key={m.key} x1={radio.x} y1={radio.y} x2={m.x} y2={m.y} stroke="#F08A4B" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="2 8" strokeLinecap="round" className="flow-line" style={{ animationDuration: '1.6s' }} />
                    ))}
                    {[0, 1, 2].map((i) => (
                      <circle key={i} cx={radio.x} cy={radio.y} r="60" fill="none" stroke="#F08A4B" strokeWidth="2">
                        <animate attributeName="r" from="60" to="230" dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity" from="0.7" to="0" dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                      </circle>
                    ))}
                    <text x={radio.x} y={radio.y + 95} textAnchor="middle" fontSize="14" fontWeight="700" fill="#F08A4B" paintOrder="stroke" stroke="#0F1B33" strokeWidth="4">
                      無線電通報網 · On air
                    </text>
                  </g>
                )}

                {/* Collaboration lines; keyed by scenario so they fade in on each switch */}
                <g key={scenario.id} style={{ animation: 'flow-in 0.6s ease-out' }} data-testid="flows">
                  {scenario.flows.map((f, i) => {
                    const { d, lx, ly } = flowPath(byKey[f.from], byKey[f.to]);
                    const id = `flow-${scenario.id}-${i}`;
                    return (
                      <g key={id}>
                        <path d={d} fill="none" stroke={lineColor} strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
                        <path id={id} d={d} fill="none" stroke={lineColor} strokeWidth="3" className="flow-line" style={{ animationDuration: hot ? '0.8s' : '2s' }} />
                        <circle r="6" fill={hot ? '#F08A4B' : '#BFD0F0'}>
                          <animateMotion dur={hot ? '1.8s' : '3.5s'} repeatCount="indefinite" begin={`${i * 0.3}s`}>
                            <mpath href={`#${id}`} />
                          </animateMotion>
                        </circle>
                        <text x={lx} y={ly} textAnchor="middle" fontSize="15" fill="#E6ECF7" fillOpacity="0.85" className="hidden sm:block" paintOrder="stroke" stroke="#0F1B33" strokeWidth="4">
                          {f.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Module blocks */}
              {modules.map((m) => {
                const alert = m.alert;
                return (
                  <div
                    key={m.key}
                    data-testid={`module-${m.key}`}
                    data-alert={alert}
                    className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border-2 text-center transition-colors duration-500 ${
                      alert ? 'animate-alert-pulse border-rescue' : 'border-white/20'
                    }`}
                    // Baseline: the module's calm green / blue. Alert: rescue orange tint.
                    style={{
                      left: `${(m.x / W) * 100}%`,
                      top: `${(m.y / H) * 100}%`,
                      width: '17%',
                      aspectRatio: '1 / 0.8',
                      backgroundColor: alert ? 'rgba(217, 107, 39, 0.22)' : m.baseColor,
                    }}
                  >
                    {m.tag && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rescue px-2 py-0.5 font-bold text-white shadow" style={{ fontSize: 'max(9px, 1.3cqw)' }} data-testid={`tag-${m.key}`}>
                        {m.tag}
                      </span>
                    )}
                    <span className={`font-extrabold leading-none ${alert ? 'text-rescue-400' : 'text-white'}`} style={{ fontSize: '6cqw' }}>
                      {m.key}
                    </span>
                    <span className="mt-1 font-semibold text-white/90" style={{ fontSize: 'max(9px, 1.9cqw)' }}>{m.zh}</span>
                    <span className="hidden uppercase tracking-wider text-white/55 sm:block" style={{ fontSize: 'max(7px, 1.15cqw)' }}>{m.en}</span>
                    {alert && <span className="absolute -right-1.5 -top-1.5 h-3 w-3 animate-ping rounded-full bg-rescue" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom controls (fixed, outside the transformed layer) */}
      <div className="fixed right-6 top-24 z-30 flex flex-col overflow-hidden rounded-xl border border-civil-400/30 bg-civil-900/90 text-white shadow-lg">
        <button type="button" onClick={() => zoomCenter(1.3)} className="h-10 w-10 text-lg font-bold hover:bg-civil-700" aria-label="Zoom in">+</button>
        <button type="button" onClick={() => zoomCenter(1 / 1.3)} className="h-10 w-10 border-t border-civil-400/20 text-lg font-bold hover:bg-civil-700" aria-label="Zoom out">−</button>
        <button type="button" onClick={reset} className="h-10 w-10 border-t border-civil-400/20 text-[10px] font-semibold text-civil-400 hover:bg-civil-700 hover:text-white" aria-label="Reset view" data-testid="zoom-reset">
          <span ref={labelRef}>100%</span>
        </button>
      </div>
    </>
  );
}
