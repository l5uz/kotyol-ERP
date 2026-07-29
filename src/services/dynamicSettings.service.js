import { STORAGE_KEYS } from '@/constants/storage.constants';
import {
  MOCK_CURRENCIES,
  MOCK_WAREHOUSES,
  MOCK_PRODUCT_CATEGORIES,
  MOCK_MATERIAL_TYPES,
  MOCK_UNITS,
  MOCK_EXPENSE_TYPES,
  MOCK_DEFECT_REASONS,
  MOCK_SERVICE_TYPES,
  MOCK_WARRANTY_TYPES,
  MOCK_INSURANCE_TYPES,
  MOCK_PRODUCTION_STAGES,
  MOCK_ROLES,
  MOCK_MOVEMENT_TYPES,
  MOCK_MOVEMENT_REASONS,
  MOCK_REVALUATION_REASONS,
  MOCK_INVENTORY_REASONS,
} from '@/features/settings/constants/settings.mock';

import { MOCK_POSITIONS, MOCK_SALARY_TYPES } from '@/features/employees/constants/employees.mock';
import { MOCK_SUPPLIERS } from '@/features/suppliers/constants/suppliers.mock';
import { dataIntegrityService } from './dataIntegrity.service';

export const INITIAL_DYNAMIC_SETTINGS = {
  productCategories: MOCK_PRODUCT_CATEGORIES,
  units: MOCK_UNITS,
  customerTypes: [
    { id: 'ctype_1', name: 'Jismoniy Shaxs', status: 'ACTIVE' },
    { id: 'ctype_2', name: 'Yuridik Shaxs', status: 'ACTIVE' },
    { id: 'ctype_3', name: 'Ulgurji Xaridor', status: 'ACTIVE' },
  ],
  serviceTypes: MOCK_SERVICE_TYPES,
  warrantyTypes: MOCK_WARRANTY_TYPES,
  priorities: [
    { id: 'prio_low', name: 'Past', code: 'LOW', badgeClass: 'bg-secondary' },
    { id: 'prio_normal', name: 'Oddiy', code: 'NORMAL', badgeClass: 'bg-info' },
    { id: 'prio_high', name: 'Yuqori', code: 'HIGH', badgeClass: 'bg-warning text-dark' },
    { id: 'prio_urgent', name: 'Shoshilinch', code: 'URGENT', badgeClass: 'bg-danger' },
  ],
  orderStatuses: [
    { id: 'ord_st_1', name: 'Yangi', code: 'NEW', badgeClass: 'bg-primary' },
    { id: 'ord_st_2', name: 'Rezervda', code: 'RESERVED', badgeClass: 'bg-info' },
    { id: 'ord_st_3', name: 'Ishlab Chiqarishda', code: 'IN_PRODUCTION', badgeClass: 'bg-warning text-dark' },
    { id: 'ord_st_4', name: 'Tayyor', code: 'COMPLETED', badgeClass: 'bg-success' },
    { id: 'ord_st_5', name: 'Bekor Qilingan', code: 'CANCELLED', badgeClass: 'bg-danger' },
  ],
  paymentStatuses: [
    { id: 'pay_1', name: 'To\'langan', code: 'PAID', badgeClass: 'bg-success' },
    { id: 'pay_2', name: 'Qisman To\'langan', code: 'PARTIAL', badgeClass: 'bg-warning text-dark' },
    { id: 'pay_3', name: 'To\'lanmagan', code: 'UNPAID', badgeClass: 'bg-danger' },
  ],
  deliveryStatuses: [
    { id: 'del_1', name: 'Yetkazildi', code: 'DELIVERED', badgeClass: 'bg-success' },
    { id: 'del_2', name: 'Yo\'lda / Yetkazilmoqda', code: 'IN_TRANSIT', badgeClass: 'bg-primary' },
    { id: 'del_3', name: 'Kutilmoqda', code: 'PENDING', badgeClass: 'bg-secondary' },
  ],
  regions: [
    { id: 'reg_1', name: 'Toshkent shahri' },
    { id: 'reg_2', name: 'Toshkent viloyati' },
    { id: 'reg_3', name: 'Andijon viloyati' },
    { id: 'reg_4', name: 'Farg\'ona viloyati' },
    { id: 'reg_5', name: 'Namangan viloyati' },
    { id: 'reg_6', name: 'Samarqand viloyati' },
    { id: 'reg_7', name: 'Buxoro viloyati' },
    { id: 'reg_8', name: 'Xorazm viloyati' },
    { id: 'reg_9', name: 'Qashqadaryo viloyati' },
    { id: 'reg_10', name: 'Surxondaryo viloyati' },
    { id: 'reg_11', name: 'Navoiy viloyati' },
    { id: 'reg_12', name: 'Jizzax viloyati' },
    { id: 'reg_13', name: 'Sirdaryo viloyati' },
    { id: 'reg_14', name: 'Qoraqalpog\'iston Respublikasi' },
  ],
  warehouses: [
    { id: 'wh_main', name: 'Asosiy Ombor', status: 'ACTIVE' },
  ],
  positions: MOCK_POSITIONS,
  salaryTypes: MOCK_SALARY_TYPES,
  expenseTypes: MOCK_EXPENSE_TYPES,
  defectReasons: MOCK_DEFECT_REASONS,
  productionStages: MOCK_PRODUCTION_STAGES,
  roles: MOCK_ROLES,
  movementTypes: MOCK_MOVEMENT_TYPES,
  movementReasons: MOCK_MOVEMENT_REASONS,
  revaluationReasons: MOCK_REVALUATION_REASONS,
  inventoryReasons: MOCK_INVENTORY_REASONS,
};

class DynamicSettingsService {
  constructor() {
    this.storageKey = STORAGE_KEYS.DYNAMIC_SETTINGS || 'kotyol_erp_dynamic_settings';
  }

  getSettings() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return { ...INITIAL_DYNAMIC_SETTINGS };
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }

  getList(key, options = {}) {
    const settings = this.getSettings();
    const list = settings[key] || INITIAL_DYNAMIC_SETTINGS[key] || [];

    if (options.includeArchived) {
      return list;
    }
    return list.filter((item) => item.status !== 'INACTIVE' && item.status !== 'ARCHIVED');
  }

  getItemById(key, id) {
    const list = this.getList(key, { includeArchived: true });
    return list.find((item) => item.id === id || item.code === id) || null;
  }

  addItem(key, item) {
    const settings = this.getSettings();
    const list = settings[key] || INITIAL_DYNAMIC_SETTINGS[key] || [];
    const newItem = { id: `${key}_${Date.now()}`, status: 'ACTIVE', ...item };
    settings[key] = [...list, newItem];
    this.saveSettings(settings);
    return newItem;
  }

  updateItem(key, id, updatedFields) {
    const settings = this.getSettings();
    const list = settings[key] || INITIAL_DYNAMIC_SETTINGS[key] || [];
    let updatedItem = null;
    settings[key] = list.map((item) => {
      if (item.id === id || item.code === id) {
        updatedItem = { ...item, ...updatedFields };
        return updatedItem;
      }
      return item;
    });
    this.saveSettings(settings);
    return updatedItem;
  }

  archiveItem(key, id) {
    return this.updateItem(key, id, { status: 'INACTIVE' });
  }

  restoreItem(key, id) {
    return this.updateItem(key, id, { status: 'ACTIVE' });
  }

  deleteItem(key, id, entityTypeForIntegrity) {
    if (entityTypeForIntegrity) {
      const integrity = dataIntegrityService.canDelete(entityTypeForIntegrity, id);
      if (!integrity.allowed) {
        return { success: false, reason: integrity.reason, canArchive: true };
      }
    }
    const settings = this.getSettings();
    const list = settings[key] || INITIAL_DYNAMIC_SETTINGS[key] || [];
    settings[key] = list.filter((item) => item.id !== id && item.code !== id);
    this.saveSettings(settings);
    return { success: true };
  }

  // Currencies
  getCurrencies() {
    return MOCK_CURRENCIES;
  }
  getCurrencyOptions() {
    return MOCK_CURRENCIES.map((c) => ({ value: c.code, label: `${c.name} (${c.symbol})` }));
  }

  // Warehouses
  getWarehouses() {
    const list = this.getList('warehouses');
    if (list && list.length > 0) return list;
    return [
      { id: 'wh_main', name: 'Asosiy Ombor' },
    ];
  }

  addWarehouseOption(option) {
    const currentList = this.getWarehouses();
    const exists = currentList.some(w => w.id === option.value || w.name === option.label);
    if (!exists) {
      this.addItem('warehouses', {
        id: option.value,
        name: option.label,
      });
    }
  }

  getWarehouseOptions() {
    return this.getWarehouses().map((w) => ({ value: w.id, label: w.name }));
  }

  // Suppliers
  getSuppliers() {
    return MOCK_SUPPLIERS;
  }
  getSupplierOptions() {
    return MOCK_SUPPLIERS.map((s) => ({ value: s.id, label: s.companyName || s.name }));
  }

  // Product Categories
  getCategories() {
    return this.getList('productCategories');
  }
  getCategoryOptions() {
    return this.getCategories().map((cat) => ({ value: cat.id, label: cat.name }));
  }

  // Material Types
  getMaterialTypes() {
    return MOCK_MATERIAL_TYPES;
  }
  getMaterialTypeOptions() {
    return MOCK_MATERIAL_TYPES.map((m) => ({ value: m.id, label: m.name }));
  }

  // Measurement Units
  getUnits() {
    return this.getList('units');
  }
  getUnitOptions() {
    return this.getUnits().map((u) => ({ value: u.id, label: `${u.name} (${u.shortName || u.code || 'dona'})` }));
  }

  // Movement Types
  getMovementTypes() {
    return MOCK_MOVEMENT_TYPES;
  }
  getMovementTypeOptions() {
    return MOCK_MOVEMENT_TYPES.map((mt) => ({ value: mt.code, label: mt.name }));
  }

  // Positions
  getPositions() {
    return this.getList('positions');
  }
  getPositionOptions() {
    return this.getPositions().map((p) => ({ value: p.id, label: p.name }));
  }

  // Salary Types
  getSalaryTypes() {
    return this.getList('salaryTypes');
  }
  getSalaryTypeOptions() {
    return this.getSalaryTypes().map((s) => ({ value: s.id, label: s.name }));
  }

  // Customer Types
  getCustomerTypes() {
    return this.getList('customerTypes');
  }
  getCustomerTypeOptions() {
    return this.getCustomerTypes().map((ct) => ({ value: ct.id, label: ct.name }));
  }

  // Inventory Reasons
  getInventoryReasons() {
    return this.getList('inventoryReasons');
  }
  getInventoryReasonOptions() {
    const list = this.getInventoryReasons();
    if (list && list.length > 0) {
      return list.map((r) => ({ value: r.id || r.name, label: r.name }));
    }
    return [
      { value: 'Rejalashtirilgan inventarizatsiya', label: 'Rejalashtirilgan inventarizatsiya' },
      { value: 'Texnik tafovutni tuzatish', label: 'Texnik tafovutni tuzatish' },
      { value: 'Kamchilik / Ortiqchalik', label: 'Kamchilik / Ortiqchalik' },
    ];
  }

  // Revaluation Reasons
  getRevaluationReasons() {
    return this.getList('revaluationReasons');
  }
  getRevaluationReasonOptions() {
    const list = this.getRevaluationReasons();
    if (list && list.length > 0) {
      return list.map((r) => ({ value: r.id || r.name, label: r.name }));
    }
    return [
      { value: 'Bozor narxi o\'zgarishi', label: 'Bozor narxi o\'zgarishi' },
      { value: 'Valyuta kursi o\'zgarishi', label: 'Valyuta kursi o\'zgarishi' },
      { value: 'Eskirish va sifat pasayishi', label: 'Eskirish va sifat pasayishi' },
    ];
  }

  // Movement Reasons
  getMovementReasons() {
    return this.getList('movementReasons');
  }
  getMovementReasonOptions() {
    const list = this.getMovementReasons();
    if (list && list.length > 0) {
      return list.map((r) => ({ value: r.id || r.name, label: r.name }));
    }
    return [
      { value: 'Ombor kirimi', label: 'Ombor kirimi' },
      { value: 'Ishlab chiqarishga topshirish', label: 'Ishlab chiqarishga topshirish' },
      { value: 'Omborlararo ko\'chirish', label: 'Omborlararo ko\'chirish' },
    ];
  }

  // Production Stages
  getProductionStages() {
    const list = this.getList('productionStages');
    if (list && list.length > 0) return list;
    return [
      { id: 'st_1', name: 'Metall Kesish va Zagotovka', code: 'CUTTING', isDefault: true },
      { id: 'st_2', name: 'Payvandlash va Yig\'ish', code: 'WELDING', isDefault: false },
      { id: 'st_3', name: 'Gidravlik Sinov', code: 'TESTING', isDefault: false },
      { id: 'st_4', name: 'Bo\'yash va Quritish', code: 'PAINTING', isDefault: false },
      { id: 'st_5', name: 'Gatovka va Qadoqlash', code: 'PACKAGING', isDefault: false },
    ];
  }

  // Expense Types
  getExpenseTypes() {
    return this.getList('expenseTypes');
  }
  getExpenseTypeOptions() {
    return this.getExpenseTypes().map((e) => ({ value: e.id, label: e.name }));
  }

  // Defect Reasons
  getDefectReasons() {
    return this.getList('defectReasons');
  }

  // Service Types
  getServiceTypes() {
    return this.getList('serviceTypes');
  }
  getServiceTypeOptions() {
    return this.getServiceTypes().map((s) => ({ value: s.id, label: s.name }));
  }

  // Warranty Types
  getWarrantyTypes() {
    return this.getList('warrantyTypes');
  }
  getWarrantyTypeOptions() {
    return this.getWarrantyTypes().map((w) => ({ value: w.id, label: w.name }));
  }

  // Roles
  getRoles() {
    return this.getList('roles');
  }

  // Priorities
  getOrderPriorities() {
    return this.getList('priorities');
  }
  getOrderPriorityOptions() {
    return (this.getOrderPriorities() || []).map((p) => ({ value: p.code || p.id, label: p.name }));
  }

  // Order Statuses
  getOrderStatuses() {
    return this.getList('orderStatuses');
  }
  getOrderStatusOptions() {
    return (this.getOrderStatuses() || []).map((st) => ({ value: st.code || st.id, label: st.name }));
  }

  // Payment Statuses
  getPaymentStatuses() {
    return this.getList('paymentStatuses');
  }
  getPaymentStatusOptions() {
    return (this.getPaymentStatuses() || []).map((ps) => ({ value: ps.code || ps.id, label: ps.name }));
  }

  // Delivery Statuses
  getDeliveryStatuses() {
    return this.getList('deliveryStatuses');
  }
  getDeliveryStatusOptions() {
    return (this.getDeliveryStatuses() || []).map((ds) => ({ value: ds.code || ds.id, label: ds.name }));
  }

  // Regions
  getRegions() {
    return this.getList('regions');
  }
  getRegionOptions() {
    return (this.getRegions() || []).map((r) => ({ value: r.name, label: r.name }));
  }

  // Production Stage Options
  getProductionStageOptions() {
    return (this.getProductionStages() || []).map((st) => ({ value: st.id, label: st.name }));
  }

  // Boiler Types
  getBoilerTypes() {
    const list = this.getList('boilerTypes');
    if (list && list.length > 0) return list;
    return [
      { id: 'bt_1', name: 'Suv Isitish Kotyoli (Водогрейный)' },
      { id: 'bt_2', name: 'Bug\' Kotyoli (Паровой)' },
      { id: 'bt_3', name: 'Moyli Kotyol (Термомасляный)' },
    ];
  }
  getBoilerTypeOptions() {
    return (this.getBoilerTypes() || []).map((b) => ({ value: b.id || b.name, label: b.name }));
  }

  // Defect Reason Options
  getDefectReasonOptions() {
    return (this.getDefectReasons() || []).map((d) => ({ value: d.id || d.name, label: d.name }));
  }

  // Insurance Types
  getInsuranceTypes() {
    const list = this.getList('insuranceTypes');
    if (list && list.length > 0) return list;
    return [
      { id: 'ins_1', name: 'Zavod kafolati va yetkazib berish sug\'urtasi' },
      { id: 'ins_2', name: 'Sanoat uskunasi to\'liq sug\'urtasi' },
    ];
  }
  getInsuranceTypeOptions() {
    return (this.getInsuranceTypes() || []).map((i) => ({ value: i.id, label: i.name }));
  }
}

export const dynamicSettingsService = new DynamicSettingsService();
