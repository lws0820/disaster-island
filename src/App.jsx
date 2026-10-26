import { useState } from 'react';
import CompassPanel from './components/CompassPanel.jsx';
import HeartMap from './components/HeartMap.jsx';
import InfoSidebar from './components/sidebar/InfoSidebar.jsx';
import { useDisasterState } from './state/useDisasterState.js';

export default function App() {
  // currentMode: 'routine' | 'typhoon' | 'earthquake'
  // scenario: beitouDisasterData resolved for currentMode (states, alerts, protocol, flows)
  const { currentMode, setCurrentMode, scenario, milestones, alertCounts } = useDisasterState();

  // Mobile only: the info sidebar is a drawer. On desktop (lg) it is always shown.
  const [drawerOpen, setDrawerOpen] = useState(false);
  const alerting = scenario.alerts.length > 0;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden" data-mode={currentMode}>
      {/* Full-screen pannable map (bottom layer) */}
      <HeartMap scenario={scenario} />

      {/* Header: sits right of the sidebar on desktop */}
      <header className="pointer-events-none fixed left-4 right-4 top-6 z-30 flex items-start justify-between gap-3 lg:left-[23rem] lg:right-6">
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-expanded={drawerOpen}
            aria-label="Toggle HEART info panel"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-civil-400/30 bg-civil-900/90 text-white lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h14M3 10h14M3 15h14" /></svg>
            {alerting && !drawerOpen && <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-rescue" />}
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rescue">TCDRA</p>
            <h1 className="text-base font-extrabold leading-tight sm:text-xl">
              社區韌性互動地圖 <span className="hidden font-semibold text-civil-400 sm:inline">Community Disaster Resilience Map</span>
            </h1>
          </div>
        </div>
        <div
          className={`pointer-events-auto hidden items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-500 sm:flex ${
            alerting ? 'border-rescue bg-rescue/15 text-rescue-400' : 'border-civil-400/40 bg-civil-900/80 text-civil-400'
          }`}
          role="status"
        >
          <span className={`h-2 w-2 rounded-full ${alerting ? 'animate-ping bg-rescue' : 'bg-emerald-400'}`} />
          {scenario.status}
        </div>
      </header>

      <InfoSidebar scenario={scenario} milestones={milestones} open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Skill-pad controller: fixed bottom-right, above everything */}
      <div className="fixed bottom-8 right-6 z-50">
        <CompassPanel currentMode={currentMode} onChange={setCurrentMode} alertCounts={alertCounts} />
      </div>
    </div>
  );
}
