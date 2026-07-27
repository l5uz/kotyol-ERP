import { dynamicSettingsService } from './dynamicSettings.service';
import { MOCK_PRODUCTS } from '@/features/products/constants/products.mock';
import { MOCK_SUPPLIERS } from '@/features/suppliers/constants/suppliers.mock';
import { MOCK_EMPLOYEES } from '@/features/employees/constants/employees.mock';
import { MOCK_RECIPES } from '@/features/recipes/constants/recipes.mock';

export const masterDataService = {
  // Master Entities Getters
  getProducts: () => MOCK_PRODUCTS,
  getProductById: (id) => MOCK_PRODUCTS.find((p) => (p.id || p.productId) === id) || null,

  getSuppliers: () => MOCK_SUPPLIERS,
  getSupplierById: (id) => MOCK_SUPPLIERS.find((s) => s.id === id) || null,

  getEmployees: () => MOCK_EMPLOYEES,
  getEmployeeById: (id) => MOCK_EMPLOYEES.find((e) => e.id === id) || null,

  getRecipes: () => MOCK_RECIPES,
  getActiveRecipeByProduct: (productId) =>
    MOCK_RECIPES.find((r) => r.productId === productId && r.status === 'ACTIVE') || null,

  // Master Settings Registries (Currencies, Warehouses, Categories, Material Types, Units, Stages, Roles)
  getCurrencies: () => dynamicSettingsService.getCurrencies(),
  getWarehouses: () => dynamicSettingsService.getWarehouses(),
  getCategories: () => dynamicSettingsService.getCategories(),
  getMaterialTypes: () => dynamicSettingsService.getMaterialTypes(),
  getUnits: () => dynamicSettingsService.getUnits(),
  getProductionStages: () => dynamicSettingsService.getProductionStages(),
  getRoles: () => dynamicSettingsService.getRoles(),
  getPositions: () => dynamicSettingsService.getPositions(),
};
