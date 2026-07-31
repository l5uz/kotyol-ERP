export const SYSTEM_INFO = {
  version: 'v1.0.0 Enterprise',
  appName: 'KotyoI Enterprise ERP Engine',
  environment: 'Production',
  databaseStatus: 'PostgreSQL 16.2 — Faol va Sog\'lom',
  apiStatus: 'REST API Gateway OK — 200 Muvaffaqiyatli',
  lastBackup: '2026-07-21 03:00 — Avtomatik Bulutli Zaxira',
  uptime: '99.98% — 30 kun',
};

export const NUMBERING_CONFIGS = [
  { id: '1', documentType: 'Buyurtmalar', prefix: 'ORD-', suffix: '', sequenceLength: 6, resetRule: 'Haqiqiy Yillik', currentPreview: 'ORD-2026-000101' },
  { id: '2', documentType: 'Ishlab Chiqarish', prefix: 'PRD-', suffix: '', sequenceLength: 6, resetRule: 'Haqiqiy Yillik', currentPreview: 'PRD-2026-000201' },
  { id: '3', documentType: 'Sotuv Hujjatlari', prefix: 'SAL-', suffix: '', sequenceLength: 6, resetRule: 'Haqiqiy Yillik', currentPreview: 'SAL-2026-000301' },
  { id: '4', documentType: 'Xarid Hujjatlari', prefix: 'PUR-', suffix: '', sequenceLength: 6, resetRule: 'Haqiqiy Yillik', currentPreview: 'PUR-2026-000401' },
  { id: '5', documentType: 'Ombor Harakatlari', prefix: 'MOV-', suffix: '', sequenceLength: 6, resetRule: 'Haqiqiy Yillik', currentPreview: 'MOV-2026-000501' },
  { id: '6', documentType: 'Servis Arizalari', prefix: 'SRV-', suffix: '', sequenceLength: 6, resetRule: 'Haqiqiy Yillik', currentPreview: 'SRV-2026-000601' },
  { id: '7', documentType: 'Xarajat Hujjatlari', prefix: 'EXP-', suffix: '', sequenceLength: 6, resetRule: 'Haqiqiy Yillik', currentPreview: 'EXP-2026-000801' },
];

export const systemApi = {
  async getSystemInfo() {
    return { success: true, data: SYSTEM_INFO };
  },

  async getNumberingConfigs() {
    return { success: true, data: NUMBERING_CONFIGS };
  },
};
