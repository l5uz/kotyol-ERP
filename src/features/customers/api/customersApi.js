import { axiosInstance } from '@/api/axiosInstance';

const mapCustomer = (item) => {
  if (!item) return null;

  let extra = { customerTypeId: 'ctype_1', region: 'Toshkent shahri', address: item.address || '' };
  if (item.address && item.address.trim().startsWith('{')) {
    try {
      extra = { ...extra, ...JSON.parse(item.address) };
    } catch (_err) {
      /* ignore */
    }
  } else {
    extra.address = item.address || '';
  }

  return {
    id: item.id,
    customerName: item.name || '',
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
    try {
      const response = await axiosInstance.get('/master-data/customers');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      let result = items.map(mapCustomer).filter(Boolean);

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
    } catch (err) {
      console.error("getCustomers error:", err);
      return { success: false, data: [], error: err };
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await axiosInstance.get('/master-data/customers');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const item = items.find((c) => String(c.id) === String(id));
      return { success: true, data: mapCustomer(item) };
    } catch (err) {
      console.error("getCustomerById error:", err);
      return { success: false, data: null, error: err };
    }
  },

  createCustomer: async (customerData) => {
    try {
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

      const response = await axiosInstance.post('/master-data/customers/create', payload).catch(async () => {
        return await axiosInstance.post('/master-data/customers', payload);
      });
      const itemData = response?.data || response;
      return { success: true, data: mapCustomer(itemData), message: "Mijoz muvaffaqiyatli saqlandi." };
    } catch (err) {
      console.error("createCustomer error:", err);
      return { success: false, error: err, message: "Mijozni saqlashda xatolik yuz berdi." };
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const currentResponse = await axiosInstance.get('/master-data/customers');
      const items = Array.isArray(currentResponse?.data) ? currentResponse.data : Array.isArray(currentResponse) ? currentResponse : [];
      const item = items.find((c) => String(c.id) === String(id));

      let currentExtra = { customerTypeId: 'ctype_1', region: 'Toshkent shahri', address: '' };
      if (item && item.address && item.address.trim().startsWith('{')) {
        try {
          currentExtra = { ...currentExtra, ...JSON.parse(item.address) };
        } catch (_err) {
          /* ignore */
        }
      } else if (item) {
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
      const itemData = response?.data || response;
      return { success: true, data: mapCustomer(itemData), message: "Mijoz ma'lumotlari yangilandi." };
    } catch (err) {
      console.error("updateCustomer error:", err);
      return { success: false, error: err, message: "Mijozni yangilashda xatolik yuz berdi." };
    }
  },

  deleteCustomer: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/customers/${id}`);
      return { success: true, message: "Mijoz bazadan o'chirildi." };
    } catch (err) {
      console.error("deleteCustomer error:", err);
      return { success: false, error: err, message: "Mijozni o'chirishda xatolik yuz berdi." };
    }
  },
};
