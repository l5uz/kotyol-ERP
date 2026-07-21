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

export const dynamicSettingsService = {
  // Currencies
  getCurrencies: () => MOCK_CURRENCIES,
  getCurrencyOptions: () =>
    MOCK_CURRENCIES.map((c) => ({ value: c.code, label: `${c.name} (${c.symbol})` })),

  // Warehouses
  getWarehouses: () => MOCK_WAREHOUSES,
  getWarehouseOptions: () =>
    MOCK_WAREHOUSES.map((w) => ({ value: w.id, label: `${w.code} — ${w.name}` })),

  // Suppliers
  getSuppliers: () => MOCK_SUPPLIERS,
  getSupplierOptions: () =>
    MOCK_SUPPLIERS.map((s) => ({ value: s.id, label: s.companyName })),

  // Product Categories
  getCategories: () => MOCK_PRODUCT_CATEGORIES,
  getCategoryOptions: () =>
    MOCK_PRODUCT_CATEGORIES.map((cat) => ({ value: cat.id, label: cat.name })),

  // Material Types
  getMaterialTypes: () => MOCK_MATERIAL_TYPES,
  getMaterialTypeOptions: () =>
    MOCK_MATERIAL_TYPES.map((m) => ({ value: m.id, label: m.name })),

  // Measurement Units
  getUnits: () => MOCK_UNITS,
  getUnitOptions: () =>
    MOCK_UNITS.map((u) => ({ value: u.id, label: `${u.name} (${u.shortName})` })),

  // Movement Types
  getMovementTypes: () => MOCK_MOVEMENT_TYPES,
  getMovementTypeOptions: () =>
    MOCK_MOVEMENT_TYPES.map((mt) => ({ value: mt.code, label: mt.name })),

  // Movement Reasons
  getMovementReasons: () => MOCK_MOVEMENT_REASONS,
  getMovementReasonOptions: () =>
    MOCK_MOVEMENT_REASONS.map((mr) => ({ value: mr.name, label: mr.name })),

  // Revaluation Reasons
  getRevaluationReasons: () => MOCK_REVALUATION_REASONS,
  getRevaluationReasonOptions: () =>
    MOCK_REVALUATION_REASONS.map((rr) => ({ value: rr.name, label: rr.name })),

  // Inventory Reasons
  getInventoryReasons: () => MOCK_INVENTORY_REASONS,
  getInventoryReasonOptions: () =>
    MOCK_INVENTORY_REASONS.map((ir) => ({ value: ir.name, label: ir.name })),

  // Production Stages
  getProductionStages: () => MOCK_PRODUCTION_STAGES,
  getStageOptions: () =>
    MOCK_PRODUCTION_STAGES.map((s) => ({ value: s.id, label: `${s.stageOrder}. ${s.stageName}` })),

  // Roles
  getRoles: () => MOCK_ROLES,
  getRoleOptions: () =>
    MOCK_ROLES.map((r) => ({ value: r.name, label: r.name })),

  // Employee Positions
  getPositions: () => MOCK_POSITIONS,
  getPositionOptions: () =>
    MOCK_POSITIONS.map((p) => ({ value: p.id, label: p.name })),

  // Salary Types
  getSalaryTypes: () => MOCK_SALARY_TYPES,
  getSalaryTypeOptions: () =>
    MOCK_SALARY_TYPES.map((st) => ({ value: st.id, label: st.name })),

  // Expense Types
  getExpenseTypes: () => MOCK_EXPENSE_TYPES,
  getExpenseTypeOptions: () =>
    MOCK_EXPENSE_TYPES.map((e) => ({ value: e.id, label: e.name })),

  // Defect Reasons
  getDefectReasons: () => MOCK_DEFECT_REASONS,
  getDefectReasonOptions: () =>
    MOCK_DEFECT_REASONS.map((d) => ({ value: d.id, label: d.name })),

  // Service Types
  getServiceTypes: () => MOCK_SERVICE_TYPES,
  getServiceTypeOptions: () =>
    MOCK_SERVICE_TYPES.map((s) => ({ value: s.id, label: s.name })),

  // Warranty Types
  getWarrantyTypes: () => MOCK_WARRANTY_TYPES,
  getWarrantyTypeOptions: () =>
    MOCK_WARRANTY_TYPES.map((w) => ({ value: w.id, label: `${w.name} (${w.duration} oy)` })),

  // Insurance Types
  getInsuranceTypes: () => MOCK_INSURANCE_TYPES,
  getInsuranceTypeOptions: () =>
    MOCK_INSURANCE_TYPES.map((i) => ({ value: i.id, label: i.name })),
};
