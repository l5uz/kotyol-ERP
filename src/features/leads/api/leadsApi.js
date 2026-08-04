import { customersApi } from '../../customers/api/customersApi';
import { axiosInstance } from '@/api/axiosInstance';

const mapLead = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    fullName: item.full_name || '',
    phone: item.phone || '',
    email: item.email || '',
    companyName: item.company_name || '',
    status: item.status || 'NEW',
    source: item.source || '',
    notes: item.notes || '',
    nextContactDate: item.next_contact_date || '',
    assignedEmployeeId: item.assigned_employee_id || '',
    assignedEmployeeName: item.assigned_employee_name || '',
    createdDate: item.created_at ? item.created_at.split('T')[0] : '',
  };
};

const mapPayload = (data) => {
  return {
    full_name: data.fullName,
    phone: data.phone,
    email: data.email || '',
    company_name: data.companyName || '',
    status: data.status || 'NEW',
    source: data.source || '',
    notes: data.notes || '',
    next_contact_date: data.nextContactDate || null,
    assigned_employee_id: data.assignedEmployeeId || '',
    assigned_employee_name: data.assignedEmployeeName || '',
  };
};

export const leadsApi = {
  getLeads: async () => {
    const response = await axiosInstance.get('/leads');
    const list = response.data || response;
    const mapped = (Array.isArray(list) ? list : []).map(mapLead).filter(Boolean);
    
    if (mapped.length === 0) {
      // Seed backend with initial demo leads
      const seedLeads = [
        { fullName: 'Alijon Valiev', phone: '+998 90 123 45 67', email: 'alijon@mail.com', companyName: 'Grand-Auto MCHJ', status: 'NEW', source: 'Telegram', notes: "Kotyol K-50kW bo'yicha qiziqdi.", nextContactDate: new Date().toISOString().split('T')[0], assignedEmployeeId: '', assignedEmployeeName: '' },
        { fullName: 'Zafar Karimov', phone: '+998 94 999 88 77', email: 'zafar@karimov.uz', companyName: 'Zafar Trans', status: 'CONTACTED', source: 'Telefon', notes: "Narxlar va o'rnatish shartlarini so'radi.", nextContactDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], assignedEmployeeId: '', assignedEmployeeName: '' },
        { fullName: 'Shahnoza Karimova', phone: '+998 93 111 22 33', email: 'shahnoza@textile.com', companyName: 'Bukhara Textile', status: 'OFFER', source: 'Tavsiya', notes: 'Tijorat taklifi yuborilgan. Tasdiqlash kutilmoqda.', nextContactDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], assignedEmployeeId: '', assignedEmployeeName: '' },
        { fullName: 'Sherzod Asadov', phone: '+998 97 777 55 44', email: '', companyName: 'Sher-Stroy', status: 'LOST', source: 'Facebook', notes: 'Narx juda qimmat dedi.', nextContactDate: '', assignedEmployeeId: '', assignedEmployeeName: '' }
      ];
      for (const item of seedLeads) {
        await leadsApi.createLead(item);
      }
      const refetched = await axiosInstance.get('/leads');
      const refetchedList = refetched.data || refetched;
      return (Array.isArray(refetchedList) ? refetchedList : []).map(mapLead).filter(Boolean);
    }
    return mapped;
  },

  getLeadById: async (id) => {
    const response = await axiosInstance.get(`/leads/${id}`);
    const data = response.data || response;
    return mapLead(data);
  },

  createLead: async (data) => {
    const payload = mapPayload(data);
    const response = await axiosInstance.post('/leads', payload);
    const result = response.data || response;
    return mapLead(result);
  },

  updateLead: async (id, data) => {
    const payload = mapPayload(data);
    const response = await axiosInstance.put(`/leads/${id}`, payload);
    const result = response.data || response;
    return mapLead(result);
  },

  deleteLead: async (id) => {
    await axiosInstance.delete(`/leads/${id}`);
    return true;
  },

  convertLeadToCustomer: async (id) => {
    const lead = await leadsApi.getLeadById(id);
    if (!lead) throw new Error('Lid topilmadi');

    await customersApi.createCustomer({
      name: lead.companyName || lead.fullName,
      phone: lead.phone,
      email: lead.email,
      customerTypeId: 'ct_1',
      region: 'Toshkent',
      status: 'ACTIVE',
      notes: `Liddan aylantirildi. Izoh: ${lead.notes}`,
    });

    return await leadsApi.updateLead(id, { ...lead, status: 'WON' });
  }
};
