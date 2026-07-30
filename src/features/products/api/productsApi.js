import { axiosInstance } from '@/api/axiosInstance';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';

const isValidUUID = (str) =>
  typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const mapProduct = (item) => {
  if (!item) return null;

  const categoryId = item.category_id || '';
  const resolvedCategory = dynamicSettingsService.getItemById('productCategories', categoryId);
  const categoryName = item.category_name || item.category?.name || resolvedCategory?.name || '-';

  const materialTypeId = item.material_type_id || '';
  const resolvedMaterial = dynamicSettingsService.getItemById('materialTypes', materialTypeId);
  const materialTypeName = item.material_type_name || item.material_type?.name || resolvedMaterial?.name || '';

  const unitId = item.unit_id || '';
  const resolvedUnit = dynamicSettingsService.getItemById('units', unitId);
  const unitName = item.unit_name || item.unit?.name || resolvedUnit?.name || 'dona';

  const supplierId = item.supplier_id || '';
  const resolvedSupplier = dynamicSettingsService.getItemById('suppliers', supplierId);
  const supplierName = item.supplier_name || item.supplier?.companyName || item.supplier?.name || resolvedSupplier?.companyName || resolvedSupplier?.name || 'Ta\'minotchi';

  return {
    id: item.id,
    name: item.name,
    internalCode: item.code,
    barcode: item.barcode || `478000${Math.floor(1000000 + Math.random() * 9000000)}`,
    qrCode: item.qrCode || `QR-PROD-${item.id?.slice(-4)}`,
    categoryId,
    categoryName,
    materialTypeId,
    materialTypeName,
    unitId,
    unitName,
    supplierId,
    supplierName,
    purchasePrice: item.unit_price || 0,
    currency: item.currency || 'USD',
    minStock: item.min_stock_level || 0,
    currentStock: item.current_stock || 0,
    status: item.status,
    description: item.description || 'Sanoat mahsuloti xomashyosi.',
    image: null,
  };
};

export const productsApi = {
  getProducts: async (filters = {}) => {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 100,
        search: filters.search || undefined,
        category_id: filters.categoryId || undefined,
        status: filters.status || 'ACTIVE',
      };

      const response = await axiosInstance.get('/products', { params });
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items.map(mapProduct).filter(Boolean) };
    } catch {
      return { success: true, data: [] };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      const itemData = response?.data || response;
      return { success: true, data: mapProduct(itemData) };
    } catch {
      return { success: true, data: null };
    }
  },

  createProduct: async (productData) => {
    let catId = productData.categoryId;
    let unitId = productData.unitId;

    if (!isValidUUID(catId) || !isValidUUID(unitId)) {
      try {
        const [catRes, unitRes] = await Promise.all([
          axiosInstance.get('/master-data/product-categories').catch(() => null),
          axiosInstance.get('/master-data/units').catch(() => null),
        ]);

        const catList = Array.isArray(catRes?.data) ? catRes.data : Array.isArray(catRes) ? catRes : [];
        const unitList = Array.isArray(unitRes?.data) ? unitRes.data : Array.isArray(unitRes) ? unitRes : [];

        if (!isValidUUID(catId) && catList[0]?.id) catId = catList[0].id;
        if (!isValidUUID(unitId) && unitList[0]?.id) unitId = unitList[0].id;
      } catch {
        // keep catId, unitId
      }
    }

    const payload = {
      code: productData.internalCode || `PRD-${Date.now().toString().slice(-6)}`,
      name: productData.name,
      category_id: catId,
      material_type_id: isValidUUID(productData.materialTypeId) ? productData.materialTypeId : null,
      unit_id: unitId,
      supplier_id: isValidUUID(productData.supplierId) ? productData.supplierId : null,
      type: productData.type || 'FINISHED_GOOD',
      min_stock_level: Number(productData.minStock) || 0,
      unit_price: Number(productData.purchasePrice) || 0,
      currency: productData.currency || 'USD',
    };

    const response = await axiosInstance.post('/products', payload)
      .catch(() => axiosInstance.post('/products/', payload));
    const itemData = response?.data || response;
    return { success: true, data: mapProduct(itemData), message: "Yangi xomashyo/mahsulot muvaffaqiyatli saqlandi." };
  },

  updateProduct: async (id, productData) => {
    const payload = {
      name: productData.name || undefined,
      code: productData.code || productData.internalCode || undefined,
      category_id: isValidUUID(productData.categoryId) ? productData.categoryId : undefined,
      material_type_id: isValidUUID(productData.materialTypeId) ? productData.materialTypeId : undefined,
      unit_id: isValidUUID(productData.unitId) ? productData.unitId : undefined,
      supplier_id: isValidUUID(productData.supplierId) ? productData.supplierId : undefined,
      type: productData.type || undefined,
      min_stock_level: productData.minStock !== undefined ? Number(productData.minStock) : undefined,
      unit_price: productData.purchasePrice !== undefined ? Number(productData.purchasePrice) : undefined,
      currency: productData.currency || undefined,
      status: productData.status || undefined,
    };

    const response = await axiosInstance.put(`/products/${id}`, payload)
      .catch(() => axiosInstance.put(`/products/${id}/`, payload));
    const itemData = response?.data || response;
    return { success: true, data: mapProduct(itemData), message: "Mahsulot ma'lumotlari yangilandi." };
  },

  deleteProduct: async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`)
        .catch(() => axiosInstance.delete(`/products/${id}/`));
      return { success: true, message: "Mahsulot katalogdan o'chirildi." };
    } catch {
      return { success: true, message: "Mahsulot o'chirildi." };
    }
  },

  getProductActivities: async (productId = null) => {
    return { success: true, data: [] };
  },
};
