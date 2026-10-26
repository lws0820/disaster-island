// Mode rules for the TCDRA state machine. Everything shown on screen comes from
// beitouDisasterData; this file only says what each mode does with it.

export const MODE_ORDER = ['routine', 'typhoon', 'earthquake'];

export const BASELINE = {
  green: '#1B4332', // 促進會深綠
  blue: '#1A2B4C', // 民防深藍
};
export const RESCUE_ORANGE = '#D96B27';

// Where each HEART module sits on the 1000 x 600 map.
export const POSITIONS = { H: [200, 160], E: [500, 100], A: [800, 160], R: [320, 450], T: [680, 450] };

export const MODES = {
  routine: {
    id: 'routine',
    zh: '日常',
    en: 'Routine',
    angle: 0,
    status: '平時整備 · Routine',
    // No overrides: every element shows its baseline status.
    overrides: {},
    // Routine shows the training milestones card instead of a protocol.
    protocol: null,
    flows: [
      { from: 'E', to: 'A', label: '志工協助名冊盤點與關懷訪視' },
      { from: 'A', to: 'H', label: '儲備物資定期配置至避難點' },
      { from: 'R', to: 'E', label: '無線電通報演練' },
    ],
  },

  typhoon: {
    id: 'typhoon',
    zh: '颱風',
    en: 'Typhoon',
    angle: 120,
    status: '颱風警報 · Typhoon alert',
    overrides: {
      'h-flood-1': 'alert',
      't-warning-1': 'alert',
    },
    protocol: {
      title: '颱風疏散撤離程序',
      en: 'Typhoon evacuation protocol',
      // Each step points at an element; `text` builds the line from that element's data.
      steps: [
        { id: 't-warning-1', text: (el) => el.typhoon_countdown_limit },
        { id: 'h-flood-1', text: (el) => `${el.location}：部署抽水機並管制低窪路段` },
        { id: 'a-registry-1', text: (el) => `啟動 ${el.monitored_vips} 位山坡地長者預防性陪伴撤離` },
        { id: 'h-school-1', text: (el) => `撤離民眾收容至石牌國小（${el.capacity}）` },
        { id: 'e-hq-1', text: () => '自訓團指揮本部動員：自救、互救、共救' },
      ],
    },
    flows: [
      { from: 'T', to: 'A', label: '350mm 預警 → 山坡地長者預防性撤離' },
      { from: 'A', to: 'H', label: '名冊長者送往石牌國小收容' },
      { from: 'E', to: 'H', label: '自訓團支援洲美低窪抽水' },
      { from: 'R', to: 'H', label: '北投機廠備援電力支援收容點' },
      { from: 'T', to: 'E', label: '強制撤離令啟動自訓團' },
    ],
  },

  earthquake: {
    id: 'earthquake',
    zh: '強震',
    en: 'Earthquake',
    angle: 240,
    status: '強震應變 · Earthquake',
    overrides: {
      'h-park-1': 'command',
      'r-comms-1': 'broadcasting',
    },
    // Draw the radio web: rings + links from this module to all others.
    radioFrom: 'R',
    protocol: {
      title: '強震應變程序',
      en: 'Earthquake response protocol',
      steps: [
        { id: 't-timer-1', text: () => 'EEW 推播：石牌、新北投就地掩護 7-15 秒' },
        { id: 'h-park-1', text: (el) => `復興防災公園開設前進指揮所（${el.location}）` },
        { id: 'r-comms-1', text: (el) => `基地台斷訊改用無線電：${el.frequency}` },
        { id: 'r-power-1', text: () => '北投機廠備援電力與水井支援指揮所' },
        { id: 'a-registry-1', text: (el) => `逐戶確認 ${el.monitored_vips} 位名冊長者安全` },
      ],
    },
    flows: [
      { from: 'T', to: 'E', label: 'EEW 推播 → 自訓團啟動' },
      { from: 'E', to: 'A', label: '確認名冊長者安全' },
      { from: 'R', to: 'H', label: '備援電力與水井支援指揮所' },
      { from: 'A', to: 'H', label: '緊急糧食送往防災公園' },
    ],
  },
};

// Label + colors for every element state.
export const STATE_STYLE = {
  ready: { label: '就緒 Ready', bg: BASELINE.green },
  active: { label: '運作中 Active', bg: BASELINE.green },
  safe: { label: '安全 Safe', bg: BASELINE.blue },
  standby: { label: '颱風潛勢區', bg: BASELINE.blue },
  alert: { label: '警戒 Alert', bg: RESCUE_ORANGE, hot: true },
  command: { label: '⚑ 指揮所 Command', bg: RESCUE_ORANGE, hot: true },
  broadcasting: { label: '通報中 On air', bg: RESCUE_ORANGE, hot: true },
};
