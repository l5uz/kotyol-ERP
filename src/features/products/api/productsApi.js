import { axiosInstance } from '@/api/axiosInstance';

const mapProduct = (item) => ({
  id: item.id,
  name: item.name,
  internalCode: item.code,
  barcode: item.barcode || `478000${Math.floor(1000000 + Math.random() * 9000000)}`,
  qrCode: item.qrCode || `QR-PROD-${item.id?.slice(-4)}`,
  categoryId: item.category_id,
  categoryName: item.category_name || 'Isitish Kotyollari',
  materialTypeId: item.material_type_id || '',
  materialTypeName: item.material_type_name || 'Xomashyo',
  unitId: item.unit_id,
  unitName: item.unit_name || 'dona',
  supplierId: item.supplier_id || '',
  supplierName: item.supplier_name || 'Ta\'minotchi',
  purchasePrice: item.unit_price || 0,
  currency: item.currency || 'USD',
  minStock: item.min_stock_level || 0,
  currentStock: item.current_stock || 0,
  status: item.status,
  description: item.description || 'Sanoat mahsuloti xomashyosi.',
  image: null,
});

export const productsApi = {
  getProducts: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 100,
      search: filters.search || undefined,
      category_id: filters.categoryId || undefined,
      status: filters.status || 'ACTIVE',
    };

    const response = await axiosInstance.get('/products', { params });
    const items = response.data || [];
    return { success: true, data: items.map(mapProduct) };
  },

  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return { success: true, data: mapProduct(response.data) };
  },

  createProduct: async (productData) => {
    const payload = {
      code: productData.internalCode,
      name: productData.name,
      category_id: productData.categoryId,
      material_type_id: productData.materialTypeId || null,
      unit_id: productData.unitId,
      supplier_id: productData.supplierId || null,
      type: productData.type || 'FINISHED_GOOD',
      min_stock_level: Number(productData.minStock) || 0,
      unit_price: Number(productData.purchasePrice) || 0,
      currency: productData.currency || 'USD',
    };

    const response = await axiosInstance.post('/products', payload);
    return { success: true, data: mapProduct(response.data), message: "Yangi xomashyo/mahsulot muvaffaqiyatli saqlandi." };
  },

  updateProduct: async (id, productData) => {
    const payload = {
      name: productData.name || undefined,
      category_id: productData.categoryId || undefined,
      material_type_id: productData.materialTypeId || undefined,
      unit_id: productData.unitId || undefined,
      supplier_id: productData.supplierId || undefined,
      type: productData.type || undefined,
      min_stock_level: productData.minStock !== undefined ? Number(productData.minStock) : undefined,
      unit_price: productData.purchasePrice !== undefined ? Number(productData.purchasePrice) : undefined,
      currency: productData.currency || undefined,
      status: productData.status || undefined,
    };

    const response = await axiosInstance.put(`/products/${id}`, payload);
    return { success: true, data: mapProduct(response.data), message: "Mahsulot ma'lumotlari yangilandi." };
  },

  deleteProduct: async (id) => {
    await axiosInstance.delete(`/products/${id}`);
    return { success: true, message: "Mahsulot katalogdan o'chirildi." };
  },

  getProductActivities: async (productId = null) => {
    return { success: true, data: [] };
  },
};
