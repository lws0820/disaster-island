import { StateChip, slideIn } from './shared.jsx';

// Extra fields an element may carry, shown as small fact rows.
const FACTS = [
  ['location', '地點'],
  ['capacity', '容量'],
  ['danger_level', '風險'],
  ['leaders', '團隊'],
  ['trained_count', '培訓'],
  ['monitored_vips', '列管'],
  ['stock_level', '儲備'],
  ['frequency', '頻率'],
  ['typhoon_countdown_limit', '撤離門檻'],
];
const factValue = (key, v) => (Array.isArray(v) ? v.join('、') : key === 'monitored_vips' ? `${v} 人` : v);

function ElementItem({ el, emphasize }) {
  return (
    <li
      className={`rounded-lg border-l-2 px-2.5 py-2 ${el.overridden ? 'border-rescue bg-rescue/15' : emphasize ? 'border-rescue/50 bg-civil-900/70' : 'border-transparent bg-civil-900/70'}`}
      data-testid={`el-${el.id}`}
      data-state={el.state}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold leading-snug">{el.name}</p>
        <StateChip style={el.style} />
      </div>
      <p className="mt-1 text-xs leading-relaxed text-white/75">{el.description}</p>
      <dl className="mt-1.5 space-y-0.5 text-[11px]">
        {FACTS.filter(([k]) => el[k] != null).map(([k, label]) => (
          <div key={k} className="flex gap-2">
            <dt className="w-12 shrink-0 text-civil-400">{label}</dt>
            <dd className="text-white/85">{factValue(k, el[k])}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

export default function ModuleCard({ module: m, elements, index, emphasizeRelevant }) {
  return (
    <section
      style={slideIn(index)}
      className={`rounded-xl border p-3 ${m.alert ? 'border-rescue/80 bg-rescue/10' : 'border-civil-400/25 bg-civil-800/80'}`}
      data-testid={`card-${m.key}`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg font-extrabold text-white ring-1 ${m.alert ? 'ring-rescue' : 'ring-white/25'}`}
          style={{ backgroundColor: m.alert ? '#D96B27' : m.baseColor }}
        >
          {m.key}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight">
            {m.zh} <span className="text-xs font-semibold text-civil-400">{m.en}</span>
          </p>
          <p className="truncate text-[11px] text-white/60">{m.tagline}</p>
        </div>
      </div>
      <ul className="mt-2.5 space-y-2">
        {elements.map((el) => (
          <ElementItem key={el.id} el={el} emphasize={emphasizeRelevant && el.relevant} />
        ))}
      </ul>
    </section>
  );
}
