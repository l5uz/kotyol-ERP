import { MOCK_SERVICES } from '../constants/services.mock';
import { documentNumberingService } from '@/services/documentNumbering.service';
import { axiosInstance } from '@/api/axiosInstance';

let servicesMemory = [...MOCK_SERVICES];

export const servicesApi = {
  async getServices(params = {}) {
    let result = [...servicesMemory];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.serviceNumber.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.boilerModelName.toLowerCase().includes(q)
      );
    }

    if (params.customerId) {
      result = result.filter((s) => s.customerId === params.customerId);
    }

    if (params.serviceTypeId) {
      result = result.filter((s) => s.serviceTypeId === params.serviceTypeId);
    }

    if (params.status) {
      result = result.filter((s) => s.status === params.status);
    }

    if (params.priority) {
      result = result.filter((s) => s.priority === params.priority);
    }

    return { success: true, data: result };
  },

  async getServiceById(id) {
    const service = servicesMemory.find((s) => s.id === id);
    if (!service) return { success: false, message: 'Servis hujjati topilmadi' };
    return { success: true, data: service };
  },

  async createService(serviceData) {
    const newService = {
      id: `srv_${Date.now()}`,
      serviceNumber: serviceData.serviceNumber || documentNumberingService.generateNumber('SERVICE'),
      customerId: serviceData.customerId,
      customerName: serviceData.customerName || 'Noma\'lum Mijoz',
      boilerId: serviceData.boilerId,
      boilerModelName: serviceData.boilerModelName || 'Sanoat Kotyoli',
      serviceTypeId: serviceData.serviceTypeId || 'srv_type_1',
      serviceTypeName: serviceData.serviceTypeName || 'Zavod Kafolati Xizmati',
      assignedEmployeeId: serviceData.assignedEmployeeId || '',
      assignedEmployeeName: serviceData.assignedEmployeeName || 'Biriktirilmagan',
      serviceDate: serviceData.serviceDate || new Date().toISOString().split('T')[0],
      priority: serviceData.priority || 'NORMAL',
      status: serviceData.status || 'NEW',
      isUnderWarranty: serviceData.isUnderWarranty ?? true,
      warrantyPeriod: serviceData.warrantyPeriod || '24 oy (Zavod kafolati faol)',
      saleDate: serviceData.saleDate || '2026-07-20',
      orderNumber: serviceData.orderNumber || 'ORD-2026-8801',
      productionNumber: serviceData.productionNumber || 'PRD-2026-9001',
      notes: serviceData.notes || '',
      attachments: [],
      timeline: [
        {
          id: `tl_${Date.now()}`,
          title: 'Servis Arizasi Yaratildi',
          description: `Servis ariza № ${serviceData.serviceNumber || 'Yangi'} rasmiylashtirildi.`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        },
      ],
    };

    servicesMemory.unshift(newService);
    return { success: true, data: newService, message: 'Servis arizasi muvaffaqiyatli rasmiylashtirildi!' };
  },

  async updateService(id, updatedData) {
    servicesMemory = servicesMemory.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
    return { success: true, message: 'Servis ma\'lumotlari yangilandi.' };
  },

  async deleteService(id) {
    servicesMemory = servicesMemory.filter((s) => s.id !== id);
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
