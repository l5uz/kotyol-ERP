import { axiosInstance } from '@/api/axiosInstance';

const mapService = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    serviceNumber: item.service_number || item.serviceNumber || '',
    customerId: item.customer_id || item.customerId || '',
    customerName: item.customer_name || item.customerName || 'Noma\'lum Mijoz',
    boilerId: item.boiler_id || item.boilerId || '',
    boilerModelName: item.boiler_model_name || item.boilerModelName || 'Sanoat Kotyoli',
    serviceTypeId: item.service_type_id || item.serviceTypeId || '',
    serviceTypeName: item.service_type_name || item.serviceTypeName || '',
    assignedEmployeeId: item.assigned_employee_id || item.assignedEmployeeId || '',
    assignedEmployeeName: item.assigned_employee_name || item.assignedEmployeeName || 'Biriktirilmagan',
    serviceDate: item.service_date || item.serviceDate || '',
    priority: item.priority || 'NORMAL',
    status: item.status || 'NEW',
    isUnderWarranty: item.is_under_warranty ?? item.isUnderWarranty ?? true,
    warrantyPeriod: item.warranty_period || item.warrantyPeriod || '',
    saleDate: item.sale_date || item.saleDate || '',
    orderNumber: item.order_number || item.orderNumber || '',
    productionNumber: item.production_number || item.productionNumber || '',
    notes: item.notes || '',
    attachments: item.attachments || [],
    timeline: item.timeline || [],
  };
};

export const servicesApi = {
  async getServices(params = {}) {
    const apiParams = {
      customer_id: params.customerId || undefined,
      service_type_id: params.serviceTypeId || undefined,
      status: params.status || undefined,
      priority: params.priority || undefined,
    };
    const response = await axiosInstance.get('/master-data/services', { params: apiParams });
    let result = (response.data || []).map(mapService).filter(Boolean);

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.serviceNumber.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.boilerModelName.toLowerCase().includes(q)
      );
    }

    return { success: true, data: result };
  },

  async getServiceById(id) {
    const response = await axiosInstance.get(`/master-data/services/${id}`);
    return { success: true, data: mapService(response.data) };
  },

  async createService(serviceData) {
    const payload = {
      service_number: serviceData.serviceNumber,
      customer_id: serviceData.customerId,
      customer_name: serviceData.customerName,
      boiler_id: serviceData.boilerId,
      boiler_model_name: serviceData.boilerModelName,
      service_type_id: serviceData.serviceTypeId,
      service_type_name: serviceData.serviceTypeName,
      assigned_employee_id: serviceData.assignedEmployeeId,
      assigned_employee_name: serviceData.assignedEmployeeName,
      service_date: serviceData.serviceDate,
      priority: serviceData.priority || 'NORMAL',
      status: serviceData.status || 'NEW',
      is_under_warranty: serviceData.isUnderWarranty ?? true,
      warranty_period: serviceData.warrantyPeriod,
      sale_date: serviceData.saleDate,
      order_number: serviceData.orderNumber,
      production_number: serviceData.productionNumber,
      notes: serviceData.notes || '',
    };
    const response = await axiosInstance.post('/master-data/services', payload).catch(async () => {
      return await axiosInstance.post('/master-data/services/create', payload);
    });
    return { success: true, data: mapService(response.data), message: 'Servis arizasi muvaffaqiyatli rasmiylashtirildi!' };
  },

  async updateService(id, updatedData) {
    const payload = {
      service_number: updatedData.serviceNumber,
      customer_id: updatedData.customerId,
      customer_name: updatedData.customerName,
      boiler_id: updatedData.boilerId,
      boiler_model_name: updatedData.boilerModelName,
      service_type_id: updatedData.serviceTypeId,
      service_type_name: updatedData.serviceTypeName,
      assigned_employee_id: updatedData.assignedEmployeeId,
      assigned_employee_name: updatedData.assignedEmployeeName,
      service_date: updatedData.serviceDate,
      priority: updatedData.priority,
      status: updatedData.status,
      is_under_warranty: updatedData.isUnderWarranty,
      warranty_period: updatedData.warrantyPeriod,
      sale_date: updatedData.saleDate,
      order_number: updatedData.orderNumber,
      production_number: updatedData.productionNumber,
      notes: updatedData.notes,
    };
    const response = await axiosInstance.put(`/master-data/services/${id}`, payload);
    return { success: true, data: mapService(response.data), message: 'Servis ma\'lumotlari yangilandi.' };
  },

  async deleteService(id) {
    await axiosInstance.delete(`/master-data/services/${id}`).catch(async () => {
      await axiosInstance.delete(`/master-data/services/${id}/delete`);
    });
    return { success: true, message: 'Servis arizasi o\'chirildi.' };
  },

  async getCustomersList() {
    try {
      const response = await axiosInstance.get('/master-data/customers');
      const items = response.data || response || [];
      return { success: true, data: Array.isArray(items) ? items.map(c => ({ id: c.id, name: c.name })) : [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async getServiceTypes() {
    return {
      success: true,
      data: [
        { value: 'INSTALLATION', label: "O'rnatish" },
        { value: 'MAINTENANCE', label: 'Profilaktika' },
        { value: 'REPAIR', label: "Ta'mirlash" },
        { value: 'WARRANTY', label: 'Kafolat xizmati' },
        { value: 'INSPECTION', label: "Texnik ko'rik" },
      ],
    };
  },

  async getServiceStatuses() {
    return {
      success: true,
      data: [
        { value: 'NEW', label: 'Yangi' },
        { value: 'IN_PROGRESS', label: 'Jarayonda' },
        { value: 'COMPLETED', label: 'Yakunlangan' },
        { value: 'CANCELLED', label: 'Bekor qilingan' },
      ],
    };
  },
};
