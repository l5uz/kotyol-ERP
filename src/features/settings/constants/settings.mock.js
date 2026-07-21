export const MOCK_COMPANY_SETTINGS = {
  name: "Kotyol Heavy Industry MCHJ",
  logo: null,
  phone: "+998 (71) 200-11-22",
  email: "info@kotyol.uz",
  website: "https://kotyol.uz",
  address: "Toshkent shahri, Sergeli tumani, Sanoat zonasi 4-daha",
  description: "Og'ir sanoat va qozon xonalar uchun bosim klapanlari hamda metall konstruksiyalar ishlab chiqarish korxonasi.",
  currency: "USD",
  timezone: "Asia/Tashkent (UTC+5)",
  dateFormat: "YYYY-MM-DD",
};

export const MOCK_CURRENCIES = [
  { id: 'curr_1', code: 'USD', name: 'AQSH Dollari', symbol: '$', rateToUSD: 1.0, isDefault: true, status: 'ACTIVE' },
  { id: 'curr_2', code: 'UZS', name: "O'zbekiston So'mi", symbol: "so'm", rateToUSD: 0.000079, isDefault: false, status: 'ACTIVE' },
  { id: 'curr_3', code: 'EUR', name: 'Evro', symbol: '€', rateToUSD: 1.09, isDefault: false, status: 'ACTIVE' },
  { id: 'curr_4', code: 'GBP', name: 'Angliya Funt Sterlingi', symbol: '£', rateToUSD: 1.28, isDefault: false, status: 'ACTIVE' },
];

export const MOCK_WAREHOUSES = [
  { id: 'wh_1', code: 'WH-01', name: 'Asosiy Tayyor Mahsulotlar Ombori', description: 'Tayyor bosim klapanlari va armaturalar saqlash ombori', isDefault: true, status: 'ACTIVE' },
  { id: 'wh_2', code: 'WH-02', name: 'Xomashyo va Metall Plitalar Ombori', description: "Zanglamaydigan po'lat plitalar va g'altaklar ombori", isDefault: false, status: 'ACTIVE' },
  { id: 'wh_3', code: 'WH-03', name: "Komplektatsiya va Yig'ish Qismlari Ombori", description: "Gidravlik nasoslar va elektrotexnika detallari ombori", isDefault: false, status: 'ACTIVE' },
];

export const MOCK_PRODUCT_CATEGORIES = [
  { id: 'cat_1', name: "Metallar va Po'latlar", description: "Zanglamaydigan po'lat va metall plitalar", color: '#0d6efd', icon: 'bi-box-seam', status: 'ACTIVE' },
  { id: 'cat_2', name: "Yig'ish Qismlari", description: "Gidravlik va pnevmatik yig'uv detallari", color: '#10b981', icon: 'bi-gear', status: 'ACTIVE' },
  { id: 'cat_3', name: 'Elektrotexnika', description: "Kabel g'altaklar va elektron datchiklar", color: '#f59e0b', icon: 'bi-lightning-charge', status: 'ACTIVE' },
  { id: 'cat_4', name: 'Kimyoviy Moddalar va Moylar', description: 'Sintetik moylar va himoya suyuqliklari', color: '#06b6d4', icon: 'bi-droplet', status: 'ACTIVE' },
  { id: 'cat_5', name: 'Quvurlar va Fitinglar', description: 'Qozon quvurlari va flanetslar', color: '#6366f1', icon: 'bi-diagram-3', status: 'ACTIVE' },
];

export const MOCK_MATERIAL_TYPES = [
  { id: 'mat_1', name: "Zanglamaydigan Po'lat (Stainless Steel)", code: 'STEEL_STAIN', description: 'AISI 304 / 316 markali po\'lat plitalar', status: 'ACTIVE' },
  { id: 'mat_2', name: "Cho'yan va Qora Metall (Iron)", code: 'IRON_CAST', description: 'Og\'ir quymalar va stanok korpuslari', status: 'ACTIVE' },
  { id: 'mat_3', name: 'Qozon Quvurlari (Pipe)', code: 'PIPE_BOILER', description: 'Yuqori bosimli choksiz metall quvurlar', status: 'ACTIVE' },
  { id: 'mat_4', name: 'Antikorrozion Bo\'yoq (Paint)', code: 'PAINT_COAT', description: 'Haroratga chidamli sanoat emallari', status: 'ACTIVE' },
  { id: 'mat_5', name: 'Gaz Klapanlari va Zadvijkalar', code: 'VALVE_GAS', description: 'Gidravlik va gaz bosim klapanlari', status: 'ACTIVE' },
  { id: 'mat_6', name: 'Elektrotexnika va Datchiklar', code: 'ELEC_SENSOR', description: 'Raqamli datchiklar hamda kontrollerlar', status: 'ACTIVE' },
  { id: 'mat_7', name: 'Bolt va Gaikalar (Bolts & Fasteners)', code: 'FAST_BOLT', description: 'Mustahkamlangan murvatlar va shaybalar', status: 'ACTIVE' },
  { id: 'mat_8', name: 'Pnevmatik Aksessuarlar', code: 'ACC_PNEUM', description: 'Rezina zichlagichlar va pnevmo-fitinglar', status: 'ACTIVE' },
];

export const MOCK_MOVEMENT_TYPES = [
  { id: 'mtype_1', code: 'PURCHASE', name: 'Kirim (Xarid)', direction: 'IN', description: 'Ta\'minotchidan xomashyo kirimi', status: 'ACTIVE' },
  { id: 'mtype_2', code: 'PRODUCTION_USAGE', name: 'Ishlab chiqarish sarfi', direction: 'OUT', description: 'Sex ish topshirig\'i uchun berildi', status: 'ACTIVE' },
  { id: 'mtype_3', code: 'SALE', name: 'Sotuv chiqimi', direction: 'OUT', description: 'Mijozga tayyor mahsulot jo\'natildi', status: 'ACTIVE' },
  { id: 'mtype_4', code: 'MANUAL_ADJUSTMENT', name: 'Manual tuzatish', direction: 'BOTH', description: 'Qoltiq zaxirasini qo\'lda to\'g\'rilash', status: 'ACTIVE' },
  { id: 'mtype_5', code: 'DEFECT', name: 'Brak / Defekt', direction: 'OUT', description: 'Nuqsonli mahsulotni ombordan chiqarish', status: 'ACTIVE' },
  { id: 'mtype_6', code: 'RETURN', name: 'Qaytarish (Return)', direction: 'IN', description: 'Ishlab chiqarishdan ortgan xomashyo qaytimi', status: 'ACTIVE' },
  { id: 'mtype_7', code: 'TRANSFER', name: 'Omborlararo o\'tkazish', direction: 'BOTH', description: 'A omboridan B omboriga ko\'chirish', status: 'ACTIVE' },
  { id: 'mtype_8', code: 'INVENTORY_CORRECTION', name: 'Inventarizatsiya tuzatishi', direction: 'BOTH', description: 'Fizik sanoq natijasida zaxirani yangilash', status: 'ACTIVE' },
  { id: 'mtype_9', code: 'REVALUATION', name: 'Qayta baholash', direction: 'INFO', description: 'Mahsulot tannarxi va hisob narxini o\'zgartirish', status: 'ACTIVE' },
];

export const MOCK_MOVEMENT_REASONS = [
  { id: 'mreas_1', name: 'Yetkazib beruvchidan rasmiy kirim', status: 'ACTIVE' },
  { id: 'mreas_2', name: 'Sex ish topshirig\'i (Work Order) sarfi', status: 'ACTIVE' },
  { id: 'mreas_3', name: 'Sotuv shartnomasi bo\'yicha jo\'natma', status: 'ACTIVE' },
  { id: 'mreas_4', name: 'Texnik ko\'rikda brak aniqlanishi', status: 'ACTIVE' },
  { id: 'mreas_5', name: 'Yacheykalarni qayta taqsimlash', status: 'ACTIVE' },
  { id: 'mreas_6', name: 'Mavsumiy inventarizatsiya natijasi', status: 'ACTIVE' },
];

export const MOCK_REVALUATION_REASONS = [
  { id: 'rreas_1', name: 'Jahom po\'lat bozori narxlari o\'sishi', status: 'ACTIVE' },
  { id: 'rreas_2', name: 'Valyuta ayirboshlash kursi o\'zgarishi', status: 'ACTIVE' },
  { id: 'rreas_3', name: 'Amortizatsiya va eskirish hisobi', status: 'ACTIVE' },
  { id: 'rreas_4', name: 'Xarid narxlari arzonlashishi', status: 'ACTIVE' },
];

export const MOCK_INVENTORY_REASONS = [
  { id: 'ireas_1', name: 'Ombor yillik to\'liq fizik sanog\'i', status: 'ACTIVE' },
  { id: 'ireas_2', name: 'Choraklik profilaktika sanog\'i', status: 'ACTIVE' },
  { id: 'ireas_3', name: 'Sex smena almashinish tekshiruvi', status: 'ACTIVE' },
];

export const MOCK_UNITS = [
  { id: 'unit_1', name: 'Dona', shortName: 'dona', description: "Birlik soni bo'yicha o'lchov" },
  { id: 'unit_2', name: 'Kilogramm', shortName: 'kg', description: "Og'irlik bo'yicha o'lchov" },
  { id: 'unit_3', name: 'Litr', shortName: 'litr', description: "Suyuqlik hajmi bo'yicha o'lchov" },
  { id: 'unit_4', name: 'Metr', shortName: 'm', description: "Uzunlik bo'yicha o'lchov" },
  { id: 'unit_5', name: 'Metr Kvadrat', shortName: 'm²', description: "Yuza maydoni bo'yicha o'lchov" },
  { id: 'unit_6', name: 'Kub Metr', shortName: 'm³', description: "Hajm bo'yicha o'lchov" },
];

export const MOCK_EXPENSE_TYPES = [
  { id: 'exp_1', name: 'Ish Haqi (Payroll)', description: 'Xodimlar va ishchilar oylik maosh xarajatlari', status: 'ACTIVE' },
  { id: 'exp_2', name: 'Transport va Logistika', description: 'Xomashyo va mahsulot yetkazib berish transporti', status: 'ACTIVE' },
  { id: 'exp_3', name: 'Elektr Energiyasi', description: 'Zavod sexi elektr energiyasi sarfi', status: 'ACTIVE' },
  { id: 'exp_4', name: 'Tabiiy Gaz va Isitish', description: 'Pechlar va isitish liniyasi gaz sarfi', status: 'ACTIVE' },
  { id: 'exp_5', name: 'Bino va Yer Ijara', description: "Ishlab chiqarish maydoni ijara to'lovi", status: 'ACTIVE' },
  { id: 'exp_6', name: 'Davlat Soliqlari', description: 'Korxona mulk va daromad soliqlari', status: 'ACTIVE' },
  { id: 'exp_7', name: 'Boshqa Operatsion Xarajatlar', description: "Ma'muriy va kutilmagan sex xarajatlari", status: 'ACTIVE' },
];

export const MOCK_DEFECT_REASONS = [
  { id: 'def_1', name: 'Xomashyo Metall Nuqsoni', description: "Metall plitada mikro-darsizlanish yoki zang mavjudligi", affectsFinance: true, status: 'ACTIVE' },
  { id: 'def_2', name: "Geometrik O'lcham Xatoligi", description: "Tokarlik ishlov berishda me'yordan chetlashish", affectsFinance: true, status: 'ACTIVE' },
  { id: 'def_3', name: 'Payvand Choroki Uzilishi', description: "Avtomatik payvand chokining sinovdan o'tmasligi", affectsFinance: false, status: 'ACTIVE' },
  { id: 'def_4', name: 'Mexanik Shikastlanish', description: 'Transportirovka jarayonida chizilish yoki urilish', affectsFinance: true, status: 'ACTIVE' },
  { id: 'def_5', name: "Yig'ish Ketma-ketligi Xatosi", description: "Detallarni noto'g'ri ketma-ketlikda yig'ish", affectsFinance: false, status: 'ACTIVE' },
];

export const MOCK_SERVICE_TYPES = [
  { id: 'srv_1', name: 'Gidravlik Diagnostika', description: 'Klapanlar bosim va zichlik sinovi diagnostikasi', status: 'ACTIVE' },
  { id: 'srv_2', name: "Kapital Ta'mirlash", description: "Pnevmatik va gidravlik nasoslar kapital ta'miri", status: 'ACTIVE' },
  { id: 'srv_3', name: 'Ultratovushli Tozalash', description: 'Detallarni moy va zangdan kimyoviy tozalash', status: 'ACTIVE' },
  { id: 'srv_4', name: "Rejali Texnik Ko'rik", description: "Sex uskunalarining har oylik profilaktik ko'rigi", status: 'ACTIVE' },
];

export const MOCK_WARRANTY_TYPES = [
  { id: 'war_1', name: 'Standart Zavod Kafolati', duration: 12, description: "12 oy davomida bepul ta'mirlash kafolati", status: 'ACTIVE' },
  { id: 'war_2', name: 'Kengaytirilgan Sanoat Kafolati', duration: 24, description: "24 oy davomida to'liq servis va qismlarni almashtirish", status: 'ACTIVE' },
  { id: 'war_3', name: 'Maxsus Servis Kafolati', duration: 36, description: '36 oy davomida doimiy texnik nazorat kafolati', status: 'ACTIVE' },
];

export const MOCK_INSURANCE_TYPES = [
  { id: 'ins_1', name: "Yuk va Transport Sug'urtasi", description: "Yetkazib berilayotgan mahsulotlarni sug'urtalash", status: 'ACTIVE' },
  { id: 'ins_2', name: "Sanoat Asbob-uskunalari Sug'urtasi", description: "Sex stanoklari va nasoslarni avariyadan sug'urtalash", status: 'ACTIVE' },
  { id: 'ins_3', name: "Ishlab Chiqarish Tavakkalchiligi Sug'urtasi", description: "Ishlab chiqarish uzilishlari xavfini sug'urtalash", status: 'ACTIVE' },
];

export const MOCK_PRODUCTION_STAGES = [
  { id: 'stg_1', stageName: 'Kesish va Tayyorlash', description: "Metall plitasi va quvurlarni o'lcham bo'yicha kesish", stageOrder: 1, defaultPrice: 15.0, color: '#3b82f6', icon: 'bi-scissors', status: 'ACTIVE' },
  { id: 'stg_2', stageName: 'Payvandlash va Biriktirish', description: 'Detallarni avtomatik argon payvandida biriktirish', stageOrder: 2, defaultPrice: 35.0, color: '#f59e0b', icon: 'bi-fire', status: 'ACTIVE' },
  { id: 'stg_3', stageName: "Bo'yash va Emallash", description: "Antikorrozion va yuqori haroratli bo'yoq berish", stageOrder: 3, defaultPrice: 20.0, color: '#10b981', icon: 'bi-paint-bucket', status: 'ACTIVE' },
  { id: 'stg_4', stageName: "Gidravlik Yig'ish", description: 'Nasos va datchiklarni yagona klapanga yig\'ish', stageOrder: 4, defaultPrice: 40.0, color: '#8b5cf6', icon: 'bi-tools', status: 'ACTIVE' },
  { id: 'stg_5', stageName: 'Bosim va Sifat Sinovi', description: "200 bar bosim ostida zichlik sinovidan o'tkazish", stageOrder: 5, defaultPrice: 25.0, color: '#ec4899', icon: 'bi-shield-check', status: 'ACTIVE' },
  { id: 'stg_6', stageName: 'Sanoat Qadoqlashi', description: "Yog'och taralarga joylash va tamg'alash", stageOrder: 6, defaultPrice: 10.0, color: '#64748b', icon: 'bi-box-seam', status: 'ACTIVE' },
];

export const MOCK_ROLES = [
  { id: 'role_1', name: 'Administrator', description: "Tizimning barcha modullariga to'liq kirish huquqi", userCount: 2, status: 'ACTIVE' },
  { id: 'role_2', name: 'Bosh Direktor', description: "Ijroiya dashboard va moliyaviy hisobotlarni ko'rish", userCount: 1, status: 'ACTIVE' },
  { id: 'role_3', name: "Ishlab Chiqarish Boshlig'i", description: 'Liniyalar, bosqichlar va ish buyurtmalarini boshqarish', userCount: 3, status: 'ACTIVE' },
  { id: 'role_4', name: 'Omborxona Mudiri', description: 'Xomashyo va tayyor mahsulot omborlarini boshqarish', userCount: 4, status: 'ACTIVE' },
  { id: 'role_5', name: 'Sotuv Menejeri', description: 'Tijorat takliflari va sotuv shartnomalarini rasmiylashtirish', userCount: 5, status: 'ACTIVE' },
  { id: 'role_6', name: 'Bosh Hisobchi', description: "Moliyaviy o'tkazmalar, ish haqi va soliqlarni kiritish", userCount: 2, status: 'ACTIVE' },
  { id: 'role_7', name: 'Servis Ustasi', description: "Uskunalar ko'rigi va diagnostika kartalarini to'ldirish", userCount: 6, status: 'ACTIVE' },
  { id: 'role_8', name: 'Sex Operator-Xodimi', description: 'Bajarilgan ish hajmi va topshiriqlarni belgilash', userCount: 18, status: 'ACTIVE' },
];

export const MOCK_PERMISSION_MODULES = [
  { id: 'mod_dash', name: 'Boshqaruv Paneli (Dashboard)', key: 'DASHBOARD' },
  { id: 'mod_wh', name: 'Omborxona (Warehouse)', key: 'WAREHOUSE' },
  { id: 'mod_prod', name: 'Ishlab Chiqarish (Production)', key: 'PRODUCTION' },
  { id: 'mod_sales', name: "Sotuv Bo'limi (Sales)", key: 'SALES' },
  { id: 'mod_fin', name: 'Moliya va Balans (Finance)', key: 'FINANCE' },
  { id: 'mod_emp', name: 'Xodimlar va HR (Employees)', key: 'EMPLOYEES' },
  { id: 'mod_cust', name: 'Mijozlar Bazasi (Customers)', key: 'CUSTOMERS' },
  { id: 'mod_sett', name: 'Tizim Sozlamalari (Settings)', key: 'SETTINGS' },
];

export const MOCK_PERMISSIONS_MATRIX = {
  SUPER_ADMIN: {
    DASHBOARD: { view: true, create: true, update: true, delete: true, export: true },
    WAREHOUSE: { view: true, create: true, update: true, delete: true, export: true },
    PRODUCTION: { view: true, create: true, update: true, delete: true, export: true },
    SALES: { view: true, create: true, update: true, delete: true, export: true },
    FINANCE: { view: true, create: true, update: true, delete: true, export: true },
    EMPLOYEES: { view: true, create: true, update: true, delete: true, export: true },
    CUSTOMERS: { view: true, create: true, update: true, delete: true, export: true },
    SETTINGS: { view: true, create: true, update: true, delete: true, export: true },
  },
  PRODUCTION_MANAGER: {
    DASHBOARD: { view: true, create: false, update: false, delete: false, export: true },
    WAREHOUSE: { view: true, create: true, update: true, delete: false, export: true },
    PRODUCTION: { view: true, create: true, update: true, delete: true, export: true },
    SALES: { view: true, create: false, update: false, delete: false, export: false },
    FINANCE: { view: false, create: false, update: false, delete: false, export: false },
    EMPLOYEES: { view: true, create: false, update: false, delete: false, export: false },
    CUSTOMERS: { view: false, create: false, update: false, delete: false, export: false },
    SETTINGS: { view: true, create: false, update: false, delete: false, export: false },
  },
};
