import { MOCK_PRODUCTS, MOCK_PRODUCT_ACTIVITIES } from '../constants/products.mock';

export const productsApi = {
  getProducts: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 300));
    let result = [...MOCK_PRODUCTS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.internalCode.toLowerCase().includes(q) ||
          p.barcode.toLowerCase().includes(q)
      );
    }

    if (filters.categoryId) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters.materialTypeId) {
      result = result.filter((p) => p.materialTypeId === filters.materialTypeId);
    }

    if (filters.supplierId) {
      result = result.filter((p) => p.supplierId === filters.supplierId);
    }

    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    return { success: true, data: result };
  },

  getProductById: async (id) => {
    await new Promise((res) => setTimeout(res, 250));
    const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
    return { success: true, data: { ...product } };
  },

  createProduct: async (productData) => {
    await new Promise((res) => setTimeout(res, 400));
    const newProduct = {
      ...productData,
      id: `prod_${Date.now()}`,
      barcode: productData.barcode || `478000${Math.floor(1000000 + Math.random() * 9000000)}`,
      qrCode: `QR-PROD-${Date.now().toString().slice(-4)}`,
      currentStock: productData.currentStock || 0,
      status: 'ACTIVE',
    };
    MOCK_PRODUCTS.unshift(newProduct);
    return { success: true, data: newProduct, message: "Yangi xomashyo/mahsulot muvaffaqiyatli saqlandi." };
  },

  updateProduct: async (id, productData) => {
    await new Promise((res) => setTimeout(res, 400));
    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index !== -1) {
      MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData };
    }
    return { success: true, data: MOCK_PRODUCTS[index], message: "Mahsulot ma'lumotlari yangilandi." };
  },

  deleteProduct: async (id) => {
    await new Promise((res) => setTimeout(res, 350));
    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index !== -1) MOCK_PRODUCTS.splice(index, 1);
    return { success: true, message: "Mahsulot katalogdan o'chirildi." };
  },

  getProductActivities: async (productId = null) => {
    await new Promise((res) => setTimeout(res, 250));
    let result = [...MOCK_PRODUCT_ACTIVITIES];
    if (productId) {
      result = result.filter((a) => a.productId === productId);
    }
    return { success: true, data: result };
  },
};
