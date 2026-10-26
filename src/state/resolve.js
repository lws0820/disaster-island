import { BASELINE, MODES, POSITIONS, RESCUE_ORANGE, STATE_STYLE } from './modes.js';

// "空間韌性 (Habitat)" -> { zh: '空間韌性', en: 'Habitat' }
const splitTitle = (title) => {
  const m = title.match(/^(.*?)\s*\((.*)\)$/);
  return m ? { zh: m[1], en: m[2] } : { zh: title, en: '' };
};

const firstNumber = (s) => Number(String(s).replace(/,/g, '').match(/\d+/)?.[0] ?? 0);

export const findElement = (data, id) =>
  Object.values(data).flatMap((m) => m.elements).find((e) => e.id === id);

// Baseline state of an element, before any mode override.
function baselineState(el) {
  if (el.status === 'warning_on_typhoon') return 'standby';
  return STATE_STYLE[el.status] ? el.status : 'ready';
}

// Module colors are calm (green / blue) outside alerts; orange is kept for alerts only.
const baselineColor = (color) => (color?.toUpperCase() === RESCUE_ORANGE ? BASELINE.green : color || BASELINE.blue);

/**
 * Turn the raw dataset + a mode id into everything the UI renders:
 * per-module alert flags, per-element state, and which elements matter in this mode.
 */
export function resolveScenario(data, modeId) {
  const mode = MODES[modeId];
  const protocolIds = new Set(mode.protocol?.steps.map((s) => s.id) ?? []);
  const isRelevant = (id) => !mode.protocol || protocolIds.has(id) || id in mode.overrides;

  const modules = Object.entries(POSITIONS).map(([key, [x, y]]) => {
    const raw = data[key];
    const elements = raw.elements.map((el) => {
      const state = mode.overrides[el.id] ?? baselineState(el);
      return { ...el, state, style: STATE_STYLE[state], relevant: isRelevant(el.id), overridden: el.id in mode.overrides };
    });
    // Alerted elements first, then relevant ones, then the rest.
    const rank = (e) => (e.overridden ? 0 : e.relevant ? 1 : 2);
    elements.sort((a, b) => rank(a) - rank(b));

    return {
      key,
      x,
      y,
      ...splitTitle(raw.title),
      tagline: raw.tagline,
      color: raw.color,
      baseColor: baselineColor(raw.color),
      // A module pulses when one of its elements is overridden in this mode.
      alert: elements.some((e) => e.overridden),
      tag: elements.find((e) => e.state === 'command') ? '⚑ 指揮所' : null,
      elements,
    };
  });

  // Alerting modules first in the sidebar.
  const sidebarOrder = [...modules].sort((a, b) => Number(b.alert) - Number(a.alert));

  const protocol = mode.protocol && {
    ...mode.protocol,
    steps: mode.protocol.steps.map((s) => {
      const el = findElement(data, s.id);
      return { id: s.id, name: el.name, text: s.text(el), state: mode.overrides[s.id] ?? null };
    }),
  };

  return {
    ...mode,
    alerts: modules.filter((m) => m.alert).map((m) => m.key),
    modules,
    sidebarOrder,
    protocol,
  };
}

// Figures for the routine "training milestones" card, read from the data.
export function trainingMilestones(data) {
  const train = findElement(data, 'e-train-1');
  const hq = findElement(data, 'e-hq-1');
  const registry = findElement(data, 'a-registry-1');
  const stock = findElement(data, 'a-stockpile-1');
  return {
    volunteers: firstNumber(train.trained_count),
    volunteersText: train.trained_count,
    trainingText: train.description,
    leaders: hq.leaders,
    stats: [
      { label: '關懷名冊 Registry', value: registry.monitored_vips, unit: '人' },
      { label: '物資儲備 Stock', value: firstNumber(stock.stock_level), suffix: '%' },
    ],
  };
}
