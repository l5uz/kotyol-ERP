import { ERP_ICONS } from '@/shared/icons';

export const MOCK_STAT_CARDS = [
  {
    id: 'stat_sales',
    title: 'Bugungi Sotuv',
    value: '$24,850.00',
    trendPercentage: 14.2,
    trendLabel: 'kechagiga nisbatan',
    icon: ERP_ICONS.FINANCE,
    iconBgColor: 'var(--erp-success-bg)',
    iconColor: 'var(--erp-success)',
  },
  {
    id: 'stat_expenses',
    title: 'Bugungi Xarajat',
    value: '$8,420.00',
    trendPercentage: -3.1,
    trendLabel: 'rejadan kamaygan',
    icon: ERP_ICONS.FINANCE,
    iconBgColor: 'var(--erp-danger-bg)',
    iconColor: 'var(--erp-danger)',
  },
  {
    id: 'stat_profit',
    title: 'Sof Foyda',
    value: '$16,430.00',
    trendPercentage: 18.5,
    trendLabel: "o'tgan haftaga nisbatan",
    icon: ERP_ICONS.FINANCE,
    iconBgColor: 'var(--erp-primary-light)',
    iconColor: 'var(--erp-primary)',
  },
  {
    id: 'stat_production',
    title: 'Ishlab Chiqarish',
    value: '1,450 Birlik',
    trendPercentage: 8.2,
    trendLabel: "kunlik me'yor o'sishi",
    icon: ERP_ICONS.PRODUCTION,
    iconBgColor: 'var(--erp-primary-light)',
    iconColor: 'var(--erp-primary)',
  },
  {
    id: 'stat_warehouse',
    title: 'Ombordagi Mahsulotlar',
    value: '84,120 Birlik',
    trendPercentage: 5.0,
    trendLabel: 'zaxira darajasi',
    icon: ERP_ICONS.WAREHOUSE,
    iconBgColor: 'var(--erp-info-bg)',
    iconColor: 'var(--erp-info)',
  },
  {
    id: 'stat_active_orders',
    title: 'Faol Buyurtmalar',
    value: '18 Buyurtma',
    trendPercentage: -2.4,
    trendLabel: 'navbatdagi ishlar',
    icon: ERP_ICONS.SETTINGS,
    iconBgColor: 'var(--erp-warning-bg)',
    iconColor: 'var(--erp-warning)',
  },
  {
    id: 'stat_services',
    title: 'Kutilayotgan Servislar',
    value: '5 Xizmat',
    trendPercentage: 0,
    trendLabel: 'rejalashtirilgan audit',
    icon: ERP_ICONS.REFRESH,
    iconBgColor: 'var(--erp-info-bg)',
    iconColor: 'var(--erp-info)',
  },
  {
    id: 'stat_low_stock',
    title: 'Kam Qolgan Mahsulotlar',
    value: '4 Birlik',
    trendPercentage: -12.0,
    trendLabel: 'shoshilinch xarid zarur',
    icon: ERP_ICONS.EXCLAMATION,
    iconBgColor: 'var(--erp-danger-bg)',
    iconColor: 'var(--erp-danger)',
  },
];

export const MOCK_SALES_EXPENSES_CHART = [
  { month: 'Yan', sales: 42000, expenses: 18000, profit: 24000 },
  { month: 'Fev', sales: 48000, expenses: 21000, profit: 27000 },
  { month: 'Mar', sales: 55000, expenses: 23000, profit: 32000 },
  { month: 'Apr', sales: 51000, expenses: 20000, profit: 31000 },
  { month: 'May', sales: 62000, expenses: 25000, profit: 37000 },
  { month: 'Iyn', sales: 74000, expenses: 28000, profit: 46000 },
  { month: 'Iyl', sales: 68000, expenses: 26000, profit: 42000 },
];

export const MOCK_PRODUCTION_WAREHOUSE_CHART = [
  { category: 'Metallar', production: 1200, warehouse: 3400 },
  { category: "Yig'ish qismlari", production: 850, warehouse: 2100 },
  { category: 'Elektrotexnika', production: 1400, warehouse: 1800 },
  { category: 'Kimyoviy moylar', production: 600, warehouse: 950 },
  { category: 'Quvurlar', production: 920, warehouse: 1500 },
];

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: 'act_1',
    title: 'Tizimga kirildi (Login)',
    timestamp: '5 daqiqa oldin',
    description: 'Operator Alex Vance tizimga muvaffaqiyatli kirdi.',
    icon: ERP_ICONS.CHECK,
  },
  {
    id: 'act_2',
    title: 'Yangi mahsulot kiritildi (Created Product)',
    timestamp: '35 daqiqa oldin',
    description: "SKU-1005 'Sanoat flanetsi 150mm' bazaga qo'shildi.",
    icon: ERP_ICONS.PLUS,
  },
  {
    id: 'act_3',
    title: "Ombor qoldig'i yangilandi (Updated Warehouse)",
    timestamp: '1 soat oldin',
    description: "B-Omborga 2,500 kg po'lat armatura kirim qilindi.",
    icon: ERP_ICONS.WAREHOUSE,
  },
  {
    id: 'act_4',
    title: "Yangi mijoz ro'yxatga olindi (Created Customer)",
    timestamp: '3 soat oldin',
    description: "Kontragent 'Apex Power Grid LLC' kartochkasi ochildi.",
    icon: ERP_ICONS.CUSTOMERS,
  },
  {
    id: 'act_5',
    title: 'Ishlab chiqarish yakunlandi (Completed Production)',
    timestamp: '5 soat oldin',
    description: "WO-801 'Og'ir bosim klapanlari' partiyasi bajarildi.",
    icon: ERP_ICONS.PRODUCTION,
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Kam qolgan mahsulot',
    message: "Mis simli g'altak 100m omborda tugadi. Shoshilinch xarid zarur.",
    type: 'danger',
    time: '10 min oldin',
  },
  {
    id: 'notif_2',
    title: 'Tugayotgan kafolat',
    message: 'A-1 liniya gidravlik press uskunasining texnik kafolat muddati 5 kunda tugaydi.',
    type: 'warning',
    time: '1 soat oldin',
  },
  {
    id: 'notif_3',
    title: 'Yangi buyurtma',
    message: 'Global Heavy Machinery Corp korxonasidan $48,500.00 qiymatidagi SO-4401 buyurtma tushdi.',
    type: 'success',
    time: '2 soat oldin',
  },
  {
    id: 'notif_4',
    title: 'Servis eslatmasi',
    message: "Ertaga soat 10:00 da B-3 liniyada rejalashtirilgan profilaktika servis auditi o'tkaziladi.",
    type: 'info',
    time: '4 soat oldin',
  },
];

export const MOCK_LATEST_ORDERS = [
  { id: 'ORD-901', client: 'Global Heavy Machinery', items: 'Sanoat klapanlari (1,200 dona)', total: '$48,500.00', date: '2026-07-20', status: 'APPROVED' },
  { id: 'ORD-902', client: 'Atlas Pipeline Solutions', items: 'Gidravlik nasoslar (8 dona)', total: '$12,300.00', date: '2026-07-20', status: 'PENDING' },
  { id: 'ORD-903', client: 'Apex Power Grid LLC', items: "Mis simli g'altak (50 dona)", total: '$94,000.00', date: '2026-07-19', status: 'PROCESSING' },
  { id: 'ORD-904', client: 'Toshkent Sanoat Qurilish', items: "Po'lat plita 3mm (5,000 kg)", total: '$34,100.00', date: '2026-07-18', status: 'COMPLETED' },
];

export const MOCK_SYSTEM_STATUS = [
  { name: 'API Servisi (Rest Client)', status: 'Ishchi holatda', latency: '24ms', ok: true },
  { name: 'Bosh Daftar Bazasi (DB)', status: 'Ishchi holatda', latency: '12ms', ok: true },
  { name: "Zavod Liniyalari Tarmog'i", status: 'Ishchi holatda', latency: '45ms', ok: true },
  { name: 'Avtomatik Zaxira Nusxasi (Backup)', status: 'Bajarildi (02:00)', latency: '0ms', ok: true },
];
