import { slideIn } from './shared.jsx';

// Typhoon / earthquake: ordered response steps built from the dataset.
export default function ProtocolCard({ protocol, index }) {
  return (
    <section style={slideIn(index)} className="rounded-xl border border-rescue bg-rescue/15 px-3 py-3" data-testid="protocol">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rescue-400">{protocol.en}</p>
      <p className="text-base font-extrabold">{protocol.title}</p>
      <ol className="mt-2 space-y-2">
        {protocol.steps.map((s, i) => (
          <li key={s.id} className="flex gap-2.5" data-testid={`step-${s.id}`}>
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                s.state ? 'bg-rescue text-white' : 'bg-civil-900 text-rescue-400 ring-1 ring-rescue/60'
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-snug">{s.text}</p>
              <p className="text-[10px] text-white/55">{s.name}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
