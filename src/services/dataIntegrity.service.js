import { MOCK_EMPLOYEES } from '@/features/employees/constants/employees.mock';
import { MOCK_PRODUCTS } from '@/features/products/constants/products.mock';
import { MOCK_PURCHASES } from '@/features/purchasing/constants/purchasing.mock';
import { MOCK_SALES } from '@/features/sales/constants/sales.mock';
import { MOCK_ORDERS } from '@/features/orders/constants/orders.mock';
import { MOCK_CUSTOMERS } from '@/features/customers/constants/customers.mock';
import { MOCK_SERVICES } from '@/features/services/constants/services.mock';
import { MOCK_EXPENSES } from '@/features/finance/constants/finance.mock';
import { MOCK_CURRENT_STOCK, MOCK_STOCK_MOVEMENTS } from '@/features/warehouse/constants/warehouse.mock';

export const dataIntegrityService = {
  /**
   * Checks whether a master data entity can be safely deleted or if deletion is blocked due to active references.
   * @param {string} entityType - e.g. 'POSITION', 'CATEGORY', 'MATERIAL_TYPE', 'UNIT', 'SUPPLIER', 'WAREHOUSE', 'PRODUCT', 'CUSTOMER_TYPE', 'SERVICE_TYPE', 'EXPENSE_TYPE', etc.
   * @param {string} entityId - Primary ID or code of the entity
   * @returns {{ allowed: boolean, reason: string|null, referenceCount: number }}
   */
  canDelete: (entityType, entityId) => {
    switch (entityType?.toUpperCase()) {
      case 'POSITION': {
        const matchingEmps = MOCK_EMPLOYEES.filter((e) => e.positionId === entityId);
        if (matchingEmps.length > 0) {
          return {
            allowed: false,
            referenceCount: matchingEmps.length,
            reason: `Ushbu lavozim tizimdagi ${matchingEmps.length} ta xodimga biriktirilgan. O'chirish o'rniga uni nofaol (INACTIVE) holatiga o'tkazishingiz mumkin.`,
          };
        }
        break;
      }

      case 'CATEGORY':
      case 'PRODUCT_CATEGORY': {
        const matchingProds = MOCK_PRODUCTS.filter((p) => p.categoryId === entityId);
        if (matchingProds.length > 0) {
          return {
            allowed: false,
            referenceCount: matchingProds.length,
            reason: `Ushbu kategoriya ${matchingProds.length} ta mahsulot va xomashyoga biriktirilgan. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      case 'MATERIAL_TYPE': {
        const matchingProds = MOCK_PRODUCTS.filter((p) => p.materialTypeId === entityId);
        if (matchingProds.length > 0) {
          return {
            allowed: false,
            referenceCount: matchingProds.length,
            reason: `Ushbu material turi ${matchingProds.length} ta xomashyoga biriktirilgan. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      case 'UNIT': {
        const matchingProds = MOCK_PRODUCTS.filter((p) => p.unitId === entityId);
        if (matchingProds.length > 0) {
          return {
            allowed: false,
            referenceCount: matchingProds.length,
            reason: `Ushbu o'lchov birligi ${matchingProds.length} ta mahsulotda qo'llanilmoqda. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      case 'SUPPLIER': {
        const matchingProds = MOCK_PRODUCTS.filter((p) => p.supplierId === entityId);
        const matchingPurchases = MOCK_PURCHASES.filter((pur) => pur.supplierId === entityId);
        const totalRefs = matchingProds.length + matchingPurchases.length;
        if (totalRefs > 0) {
          return {
            allowed: false,
            referenceCount: totalRefs,
            reason: `Ushbu ta'minotchi korxona ${matchingProds.length} ta mahsulot va ${matchingPurchases.length} ta xarid hujjatiga biriktirilgan. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      case 'WAREHOUSE': {
        const matchingStock = MOCK_CURRENT_STOCK.filter((s) => s.warehouseId === entityId);
        const matchingPurchases = MOCK_PURCHASES.filter((pur) => pur.warehouseId === entityId);
        const totalRefs = matchingStock.length + matchingPurchases.length;
        if (totalRefs > 0) {
          return {
            allowed: false,
            referenceCount: totalRefs,
            reason: `Ushbu omborxonada ${matchingStock.length} turdagi zaxira va ${matchingPurchases.length} ta kirim hujjati mavjud. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      case 'PRODUCT': {
        const matchingStock = MOCK_CURRENT_STOCK.filter((s) => (s.id || s.productId) === entityId);
        const matchingMovements = MOCK_STOCK_MOVEMENTS.filter((m) => m.productId === entityId);
        const totalRefs = matchingStock.length + matchingMovements.length;
        if (totalRefs > 0) {
          return {
            allowed: false,
            referenceCount: totalRefs,
            reason: `Ushbu mahsulot ombor zaxirasi va ${matchingMovements.length} ta ombor harakatlariga bog'langan. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      case 'CUSTOMER_TYPE': {
        const matchingCusts = MOCK_CUSTOMERS.filter((c) => c.customerTypeId === entityId);
        if (matchingCusts.length > 0) {
          return {
            allowed: false,
            referenceCount: matchingCusts.length,
            reason: `Ushbu mijoz turi ${matchingCusts.length} ta mijozga biriktirilgan. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      case 'SERVICE_TYPE': {
        const matchingServs = MOCK_SERVICES.filter((s) => s.serviceTypeId === entityId || s.serviceType === entityId);
        if (matchingServs.length > 0) {
          return {
            allowed: false,
            referenceCount: matchingServs.length,
            reason: `Ushbu servis turi ${matchingServs.length} ta servis ariza va hujjatlariga bog'langan. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      case 'EXPENSE_TYPE': {
        const matchingExp = MOCK_EXPENSES.filter((e) => e.expenseTypeId === entityId || e.typeId === entityId);
        if (matchingExp.length > 0) {
          return {
            allowed: false,
            referenceCount: matchingExp.length,
            reason: `Ushbu xarajat turi ${matchingExp.length} ta moliya yozuvida foydalanilmoqda. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      case 'ROLE': {
        const matchingEmps = MOCK_EMPLOYEES.filter((e) => e.role === entityId || e.roleId === entityId);
        if (matchingEmps.length > 0) {
          return {
            allowed: false,
            referenceCount: matchingEmps.length,
            reason: `Ushbu tizim roli ${matchingEmps.length} ta foydalanuvchiga tayinlangan. O'chirish taqiqlangan.`,
          };
        }
        break;
      }

      default:
        break;
    }

    return { allowed: true, reason: null, referenceCount: 0 };
  },
};

