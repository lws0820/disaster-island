import { BASELINE } from '../../state/modes.js';
import { CountUp, slideIn } from './shared.jsx';

// Routine mode: community training milestones.
export default function MilestonesCard({ milestones, index }) {
  return (
    <section style={{ ...slideIn(index), backgroundColor: BASELINE.green }} className="rounded-xl border border-white/15 px-3 py-3" data-testid="milestones">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/80">社區培訓里程碑 Training milestones</p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold tabular-nums">
          <CountUp value={milestones.volunteers} />+
        </span>
        <span className="text-sm font-semibold text-emerald-100">自救志工</span>
      </p>
      <p className="mt-1 text-xs text-white/80">{milestones.volunteersText}</p>
      <p className="mt-2 text-xs leading-relaxed text-white/70">{milestones.trainingText}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {milestones.stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-black/20 px-2.5 py-1.5">
            <p className="text-[10px] text-emerald-100/70">{s.label}</p>
            <p className="text-lg font-extrabold tabular-nums">
              <CountUp value={s.value} />
              {s.suffix}
              {s.unit && <span className="ml-1 text-xs font-semibold text-emerald-100/70">{s.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-emerald-100/70">自訓團幹部</p>
      <p className="text-xs text-white/85">{milestones.leaders.join('、')}</p>
    </section>
  );
}
