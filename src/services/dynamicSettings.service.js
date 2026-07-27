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
    { id: 'reg_3', name: 'Samarqand viloyati' },
    { id: 'reg_4', name: 'Farg\'ona viloyati' },
    { id: 'reg_5', name: 'Andijon viloyati' },
    { id: 'reg_6', name: 'Namangan viloyati' },
    { id: 'reg_7', name: 'Buxoro viloyati' },
    { id: 'reg_8', name: 'Navoiy viloyati' },
    { id: 'reg_9', name: 'Qashqadaryo viloyati' },
    { id: 'reg_10', name: 'Surxondaryo viloyati' },
    { id: 'reg_11', name: 'Xorazm viloyati' },
    { id: 'reg_12', name: 'Jizzax viloyati' },
    { id: 'reg_13', name: 'Sirdaryo viloyati' },
    { id: 'reg_14', name: 'Qoraqalpog\'iston Respublikasi' },
  ],
  serviceStatuses: [
    { id: 'srv_st_1', code: 'NEW', name: 'Yangi Ariza' },
    { id: 'srv_st_2', code: 'IN_PROGRESS', name: 'Diagnostika va Ta\'mirda' },
    { id: 'srv_st_3', code: 'COMPLETED', name: 'Bajarildi' },
    { id: 'srv_st_4', code: 'CANCELLED', name: 'Bekor Qilingan' },
  ],
};

class DynamicSettingsService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.DYNAMIC_SETTINGS);
      if (!existing) {
        localStorage.setItem(STORAGE_KEYS.DYNAMIC_SETTINGS, JSON.stringify(INITIAL_DYNAMIC_SETTINGS));
      }
    } catch (e) {
      console.warn('LocalStorage error in dynamicSettingsService', e);
    }
  }

  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DYNAMIC_SETTINGS);
      return data ? JSON.parse(data) : INITIAL_DYNAMIC_SETTINGS;
    } catch {
      return INITIAL_DYNAMIC_SETTINGS;
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.DYNAMIC_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage error saving settings', e);
    }
  }

  getList(key, options = {}) {
    const { includeArchived = true } = options;
    const settings = this.getSettings();
    const list = settings[key] || INITIAL_DYNAMIC_SETTINGS[key] || [];
    if (includeArchived) return list;
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
    return MOCK_WAREHOUSES;
  }
  getWarehouseOptions() {
    return MOCK_WAREHOUSES.map((w) => ({ value: w.id, label: `${w.code} — ${w.name}` }));
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

  // Movement Reasons
  getMovementReasons() {
    return MOCK_MOVEMENT_REASONS;
  }
  getMovementReasonOptions() {
    return MOCK_MOVEMENT_REASONS.map((mr) => ({ value: mr.name, label: mr.name }));
  }

  // Revaluation Reasons
  getRevaluationReasons() {
    return MOCK_REVALUATION_REASONS;
  }
  getRevaluationReasonOptions() {
    return MOCK_REVALUATION_REASONS.map((rr) => ({ value: rr.name, label: rr.name }));
  }

  // Inventory Reasons
  getInventoryReasons() {
    return MOCK_INVENTORY_REASONS;
  }
  getInventoryReasonOptions() {
    return MOCK_INVENTORY_REASONS.map((ir) => ({ value: ir.name, label: ir.name }));
  }

  // Production Stages
  getProductionStages() {
    return MOCK_PRODUCTION_STAGES;
  }
  getStageOptions() {
    return MOCK_PRODUCTION_STAGES.map((s) => ({ value: s.id, label: `${s.stageOrder}. ${s.stageName}` }));
  }

  // Roles
  getRoles() {
    return MOCK_ROLES;
  }
  getRoleOptions() {
    return MOCK_ROLES.map((r) => ({ value: r.name, label: r.name }));
  }

  // Employee Positions
  getPositions() {
    return MOCK_POSITIONS;
  }
  getPositionOptions() {
    return MOCK_POSITIONS.map((p) => ({ value: p.id, label: p.name }));
  }

  // Salary Types
  getSalaryTypes() {
    return MOCK_SALARY_TYPES;
  }
  getSalaryTypeOptions() {
    return MOCK_SALARY_TYPES.map((st) => ({ value: st.id, label: st.name }));
  }

  // Expense Types
  getExpenseTypes() {
    return MOCK_EXPENSE_TYPES;
  }
  getExpenseTypeOptions() {
    return MOCK_EXPENSE_TYPES.map((e) => ({ value: e.id, label: e.name }));
  }

  // Defect Reasons
  getDefectReasons() {
    return MOCK_DEFECT_REASONS;
  }
  getDefectReasonOptions() {
    return MOCK_DEFECT_REASONS.map((d) => ({ value: d.id, label: d.name }));
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
    return this.getWarrantyTypes().map((w) => ({ value: w.id, label: `${w.name} (${w.duration || 12} oy)` }));
  }

  // Insurance Types
  getInsuranceTypes() {
    return MOCK_INSURANCE_TYPES;
  }
  getInsuranceTypeOptions() {
    return MOCK_INSURANCE_TYPES.map((i) => ({ value: i.id, label: i.name }));
  }

  // Customer Types
  getCustomerTypes() {
    return this.getList('customerTypes');
  }
  getCustomerTypeOptions() {
    return this.getCustomerTypes().map((ct) => ({ value: ct.id, label: ct.name }));
  }

  // Regions
  getRegions() {
    return this.getList('regions');
  }
  getRegionOptions() {
    return this.getRegions().map((r) => ({ value: r.name, label: r.name }));
  }

  // Order Priorities
  getOrderPriorities() {
    return this.getList('priorities');
  }
  getOrderPriorityOptions() {
    return this.getOrderPriorities().map((p) => ({ value: p.code, label: p.name }));
  }

  // Order Statuses
  getOrderStatuses() {
    return this.getList('orderStatuses');
  }
  getOrderStatusOptions() {
    return this.getOrderStatuses().map((s) => ({ value: s.code, label: s.name }));
  }

  // Service Statuses
  getServiceStatuses() {
    return this.getList('serviceStatuses');
  }
  getServiceStatusOptions() {
    return this.getServiceStatuses().map((s) => ({ value: s.code, label: s.name }));
  }
}

export const dynamicSettingsService = new DynamicSettingsService();
