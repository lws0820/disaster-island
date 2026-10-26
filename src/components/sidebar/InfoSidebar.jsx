import { useEffect, useState } from 'react';
import FlowsCard from './FlowsCard.jsx';
import MilestonesCard from './MilestonesCard.jsx';
import ModuleCard from './ModuleCard.jsx';
import ProtocolCard from './ProtocolCard.jsx';

export default function InfoSidebar({ scenario, milestones, open, onClose }) {
  const hasProtocol = Boolean(scenario.protocol);
  // In disaster modes the list is filtered to protocol-related elements by default.
  const [showAll, setShowAll] = useState(false);
  useEffect(() => setShowAll(false), [scenario.id]);
  const filtered = hasProtocol && !showAll;

  const cards = scenario.sidebarOrder
    .map((m) => ({ module: m, elements: filtered ? m.elements.filter((e) => e.relevant) : m.elements }))
    .filter((c) => c.elements.length > 0);
  const hiddenCount = scenario.modules.reduce((n, m) => n + m.elements.length, 0) - cards.reduce((n, c) => n + c.elements.length, 0);

  let i = 0; // stagger index

  return (
    <aside
      className={`fixed bottom-48 left-4 top-20 z-40 flex w-[min(20rem,calc(100vw-6rem))] flex-col overflow-hidden rounded-2xl border border-civil-400/25 bg-civil-900/95 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:bottom-6 lg:left-6 lg:top-6 lg:w-80 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'
      }`}
      aria-label="HEART disaster info"
      data-testid="sidebar"
    >
      <div className="border-b border-civil-400/20 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rescue">北投 HEART 韌性資訊</p>
            <p key={scenario.id} className="text-lg font-extrabold" style={{ animation: 'flow-in 0.4s ease-out' }}>
              {scenario.zh} <span className="text-sm font-semibold text-civil-400">{scenario.en}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} className="-mr-1 rounded-lg p-1 text-civil-400 hover:text-white lg:hidden" aria-label="Close info panel">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </div>
        {hasProtocol && (
          <div className="mt-2 inline-flex rounded-lg bg-civil-800 p-0.5 text-[11px] font-semibold" role="group" aria-label="Filter">
            {[
              [false, '相關 Relevant'],
              [true, '全部 All'],
            ].map(([value, label]) => (
              <button
                key={label}
                type="button"
                onClick={() => setShowAll(value)}
                aria-pressed={showAll === value}
                className={`rounded-md px-2.5 py-1 transition-colors ${showAll === value ? 'bg-rescue text-white' : 'text-civil-400 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Keyed by mode: every switch remounts the cards so they slide in again */}
      <div key={scenario.id} className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4" data-testid="sidebar-cards">
        {hasProtocol ? <ProtocolCard protocol={scenario.protocol} index={i++} /> : <MilestonesCard milestones={milestones} index={i++} />}

        {cards.map((c) => (
          <ModuleCard key={c.module.key} module={c.module} elements={c.elements} index={i++} emphasizeRelevant={hasProtocol} />
        ))}

        {filtered && hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="w-full rounded-xl border border-dashed border-civil-400/40 py-2 text-xs font-semibold text-civil-400 hover:border-rescue hover:text-white"
            data-testid="show-all"
          >
            其他 {hiddenCount} 項據點已隱藏 · 顯示全部
          </button>
        )}

        <FlowsCard flows={scenario.flows} hot={hasProtocol} index={i++} />
      </div>
    </aside>
  );
}
