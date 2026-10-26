import { useEffect, useMemo, useState } from 'react';
import { beitouDisasterData } from '../data/beitouDisasterData.js';
import { MODES, MODE_ORDER } from './modes.js';
import { resolveScenario, trainingMilestones } from './resolve.js';

/**
 * Single source of truth for the app.
 * - `currentMode`: 'routine' | 'typhoon' | 'earthquake'
 * - `scenario`: the dataset resolved for that mode (states, alerts, protocol, flows)
 * - `alertCounts`: how many elements each mode puts on alert (shown on the compass)
 */
export function useDisasterState(initialMode = 'routine') {
  const [currentMode, setCurrentModeRaw] = useState(initialMode);
  const data = beitouDisasterData;

  const setCurrentMode = (mode) => {
    if (MODES[mode]) setCurrentModeRaw(mode);
  };

  const scenario = useMemo(() => resolveScenario(data, currentMode), [data, currentMode]);
  const milestones = useMemo(() => trainingMilestones(data), [data]);
  const alertCounts = useMemo(
    () => Object.fromEntries(MODE_ORDER.map((m) => [m, Object.keys(MODES[m].overrides).length])),
    []
  );

  // Keyboard shortcuts 1 / 2 / 3 switch modes.
  useEffect(() => {
    const onKey = (e) => {
      const i = ['1', '2', '3'].indexOf(e.key);
      if (i !== -1) setCurrentModeRaw(MODE_ORDER[i]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return { data, currentMode, setCurrentMode, scenario, milestones, alertCounts };
}
