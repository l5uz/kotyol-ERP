import { axiosInstance } from '@/api/axiosInstance';

const mapCustomer = (item) => {
  if (!item) return null;
  
  let extra = { customerTypeId: 'ctype_1', region: 'Toshkent shahri', address: item.address || '' };
  if (item.address && item.address.trim().startsWith('{')) {
    try {
      extra = { ...extra, ...JSON.parse(item.address) };
    } catch {
      extra.address = item.address;
    }
  } else {
    extra.address = item.address || '';
  }

  return {
    id: item.id,
    customerName: item.name,
    contactPerson: item.contact_name || '',
    phone: item.phone || '',
    email: item.email || '',
    address: extra.address,
    tin: item.code || '',
    customerTypeId: extra.customerTypeId,
    customerTypeName: extra.customerTypeId === 'ctype_2' ? 'Yuridik Shaxs' : 'Jismoniy Shaxs',
    region: extra.region,
    status: item.status || 'ACTIVE',
    createdDate: item.created_at?.split('T')[0] || '',
    updatedDate: item.updated_at?.split('T')[0] || '',
    timeline: [],
  };
};

export const customersApi = {
  getCustomers: async (filters = {}) => {
    const response = await axiosInstance.get('/master-data/customers');
    let result = (response.data || []).map(mapCustomer);

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          (c.tin && c.tin.includes(q))
      );
    }

    if (filters.customerTypeId) {
      result = result.filter((c) => c.customerTypeId === filters.customerTypeId);
    }

    if (filters.region) {
      result = result.filter((c) => c.region === filters.region);
    }

    if (filters.status) {
      result = result.filter((c) => c.status === filters.status);
    }

    return { success: true, data: result };
  },

  getCustomerById: async (id) => {
    const response = await axiosInstance.get('/master-data/customers');
    const item = (response.data || []).find((c) => c.id === id);
    return { success: true, data: mapCustomer(item) };
  },

  createCustomer: async (customerData) => {
    const addressStr = JSON.stringify({
      customerTypeId: customerData.customerTypeId || 'ctype_1',
      region: customerData.region || 'Toshkent shahri',
      address: customerData.address || '',
    });

    const payload = {
      code: customerData.tin || `CUST-${Date.now()}`,
      name: customerData.customerName,
      contact_name: customerData.contactPerson || '',
      phone: customerData.phone || '',
      email: customerData.email || '',
      address: addressStr,
    };

    const response = await axiosInstance.post('/master-data/customers/create', payload);
    return { success: true, data: mapCustomer(response.data), message: "Mijoz muvaffaqiyatli saqlandi." };
  },

  updateCustomer: async (id, customerData) => {
    const currentResponse = await axiosInstance.get('/master-data/customers');
    const item = (currentResponse.data || []).find((c) => c.id === id);
    if (!item) return { success: false, message: "Mijoz topilmadi." };

    let currentExtra = { customerTypeId: 'ctype_1', region: 'Toshkent shahri', address: '' };
    if (item.address && item.address.trim().startsWith('{')) {
      try {
        currentExtra = { ...currentExtra, ...JSON.parse(item.address) };
      } catch {}
    } else {
      currentExtra.address = item.address || '';
    }

    const addressStr = JSON.stringify({
      customerTypeId: customerData.customerTypeId || currentExtra.customerTypeId,
      region: customerData.region || currentExtra.region,
      address: customerData.address !== undefined ? customerData.address : currentExtra.address,
    });

    const payload = {
      code: customerData.tin || undefined,
      name: customerData.customerName || undefined,
      contact_name: customerData.contactPerson !== undefined ? customerData.contactPerson : undefined,
      phone: customerData.phone !== undefined ? customerData.phone : undefined,
      email: customerData.email !== undefined ? customerData.email : undefined,
      address: addressStr,
      status: customerData.status || undefined,
    };

    const response = await axiosInstance.put(`/master-data/customers/${id}`, payload);
    return { success: true, data: mapCustomer(response.data), message: "Mijoz ma'lumotlari yangilandi." };
  },

  deleteCustomer: async (id) => {
    await axiosInstance.delete(`/master-data/customers/${id}`);
    return { success: true, message: "Mijoz bazadan o'chirildi." };
  },
};
