/**
 * Centralized Enterprise Document Numbering System Service - Kotyol ERP
 * Generates reusable, backend-ready, configurable document numbers.
 */

const DEFAULT_CONFIGS = {
  ORDER: { prefix: 'ORD', sequenceLength: 6, currentCounter: 101 },
  PRODUCTION: { prefix: 'PRD', sequenceLength: 6, currentCounter: 201 },
  SALE: { prefix: 'SAL', sequenceLength: 6, currentCounter: 301 },
  INVOICE: { prefix: 'INV', sequenceLength: 6, currentCounter: 7001 },
  PURCHASE: { prefix: 'PUR', sequenceLength: 6, currentCounter: 401 },
  MOVEMENT: { prefix: 'MOV', sequenceLength: 6, currentCounter: 501 },
  SERVICE: { prefix: 'SRV', sequenceLength: 6, currentCounter: 601 },
  BOILER: { prefix: 'BOIL', sequenceLength: 6, currentCounter: 101 },
  RECIPE: { prefix: 'REC', sequenceLength: 6, currentCounter: 801 },
};

let numberingState = { ...DEFAULT_CONFIGS };

export const documentNumberingService = {
  /**
   * Generates a formatted document number based on type and year
   * Example: generateNumber('ORDER') -> "ORD-2026-000101"
   */
  generateNumber(documentType, year = new Date().getFullYear()) {
    const typeKey = (documentType || '').toUpperCase();
    const config = numberingState[typeKey] || { prefix: 'DOC', sequenceLength: 6, currentCounter: 1 };

    const paddedCounter = String(config.currentCounter).padStart(config.sequenceLength, '0');
    const documentNumber = `${config.prefix}-${year}-${paddedCounter}`;

    // Auto-increment counter for next call
    numberingState[typeKey] = {
      ...config,
      currentCounter: config.currentCounter + 1,
    };

    return documentNumber;
  },

  /**
   * Returns current configuration for a document type
   */
  getConfig(documentType) {
    const typeKey = (documentType || '').toUpperCase();
    return numberingState[typeKey] || DEFAULT_CONFIGS.ORDER;
  },

  /**
   * Updates configuration dynamically (Administrator Settings backend-ready)
   */
  updateConfig(documentType, newConfig) {
    const typeKey = (documentType || '').toUpperCase();
    numberingState[typeKey] = {
      ...numberingState[typeKey],
      ...newConfig,
    };
  },
};
