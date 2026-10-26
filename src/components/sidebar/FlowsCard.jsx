import { slideIn } from './shared.jsx';

export default function FlowsCard({ flows, hot, index }) {
  return (
    <section style={slideIn(index)} className="rounded-xl border border-civil-400/20 bg-civil-800/80 px-3 py-2.5">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-civil-400">資源調度 Resource flows</p>
      <ul className="space-y-1 text-xs">
        {flows.map((f) => (
          <li key={`${f.from}${f.to}`} className="flex gap-2">
            <span className={`font-mono font-bold ${hot ? 'text-rescue-400' : 'text-civil-400'}`}>{f.from}→{f.to}</span>
            <span className="text-white/85">{f.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
