export const beitouDisasterData = {
  // ==========================================
  // H (Habitat) 空間韌性：真實避難所與災性潛勢
  // ==========================================
  H: {
    title: "空間韌性 (Habitat)",
    tagline: "北投在地避難與風險熱區",
    color: "#1B4332", // 促進會深綠
    elements: [
      {
        id: "h-park-1",
        name: "復興防災公園",
        location: "北投區中和街200號",
        description: "北投區核心室外緊急避難據點，配置物資管理站、臨時伙食區與帳篷區，可抽取立農公園防災地下水井。",
        status: "ready",
        capacity: "14,495 平方公尺 (短期收容)"
      },
      {
        id: "h-school-1",
        name: "石牌國民小學 (室內收容所)",
        location: "北投區致遠二路80號",
        description: "兼具耐震補強與室內活動中心空間，災時作為大型室內避難收容安置點。",
        status: "ready",
        capacity: "容納約 500 人"
      },
      {
        id: "h-flood-1",
        name: "洲美、大漢溪沿岸低窪路段",
        location: "承德路七段與洲美快速道路周邊",
        description: "颱風或強降雨期間易積淹水的高風險潛勢區，需特別注意抽水機部署。",
        status: "warning_on_typhoon",
        danger_level: "High"
      }
    ]
  },

  // ==========================================
  // E (Empower) 培力與機會：促進會與自訓團戰力
  // ==========================================
  E: {
    title: "培力與機會 (Empower)",
    tagline: "深耕地方的民間自訓組織",
    color: "#D96B27", // 促進會救援橘
    elements: [
      {
        id: "e-hq-1",
        name: "北投自訓團指揮本部",
        description: "由團長廖文祥、副團長朱慎安帶領，以行動培養勇氣，落實『自救、互救、共救』的在地互助據點。",
        leaders: ["團長：廖文祥", "副團長：朱慎安", "專任教官：陳麒安"],
        status: "active"
      },
      {
        id: "e-train-1",
        name: "在地防災士暨急救員培訓",
        description: "定期於北投社區推廣急救技能（外傷處理、AED/滅火器實作）與民防教育。",
        trained_count: "已累積培訓 150+ 名社區自救志工",
        status: "active"
      }
    ]
  },

  // ==========================================
  // A (Accompany) 陪伴與關懷：弱勢網絡與儲備
  // ==========================================
  A: {
    title: "陪伴與關懷 (Accompany)",
    tagline: "點亮脆弱角落的關懷網絡",
    color: "#1A2B4C", // 促進會民防深藍
    elements: [
      {
        id: "a-registry-1",
        name: "北投長者與行動不便者防災名冊",
        description: "與在地鄰里長協作，精準盤點北投山坡地（如泉源里、林泉里）行動不便之獨居老人，於災前啟動預防性陪伴。",
        monitored_vips: 42,
        status: "safe"
      },
      {
        id: "a-stockpile-1",
        name: "物資緊急儲備庫房",
        description: "日常儲備民防與急救裝備、緊急糧食與3日防寒物資，確保不斷糧。",
        stock_level: "92% 備足",
        status: "safe"
      }
    ]
  },

  // ==========================================
  // R (Resilience) 機制韌性：跨單位與能源備援
  // ==========================================
  R: {
    title: "機制韌性 (Resilience)",
    tagline: "跨局處與跨鄰里的韌性聯防鏈",
    color: "#1B4332",
    elements: [
      {
        id: "r-comms-1",
        name: "自訓團民間無線電通報網",
        description: "預防強震導致中華電信等基地台斷訊，使用特高頻（VHF/UHF）無線電建立跨鄰里緊急通報鏈。",
        frequency: "主頻道 144.XX MHz / 備用頻道 433.XX MHz",
        status: "ready"
      },
      {
        id: "r-power-1",
        name: "捷運北投會館逃生體驗與發電備援",
        location: "北投區大業路527巷88號",
        description: "依託北投機廠之大容量備援電力與水井資源，作為災時跨區資源调度的備援樞紐。",
        status: "ready"
      }
    ]
  },

  // ==========================================
  // T (Time) 黃金時間：速度與預警系統
  // ==========================================
  T: {
    title: "黃金時間 (Time)",
    tagline: "與時間賽跑的黃金救災線",
    color: "#D96B27",
    elements: [
      {
        id: "t-warning-1",
        name: "大屯山土石流秒級預警系統",
        description: "針對北投山區（如秀山路、泉源路）土石流潛勢溪流，介接氣象局雨量監測，計算黃金疏散撤離時間。",
        typhoon_countdown_limit: "強降雨達 350mm 即刻啟動 30 分鐘強制撤離",
        status: "safe"
      },
      {
        id: "t-timer-1",
        name: "強震『強震即時警報 (EEW)』推播",
        description: "介接國家級地震預警，為北投核心人口密集區（石牌、新北投）爭取 7-15 秒之關鍵就地掩護黃金時間。",
        status: "safe"
      }
    ]
  }
};
