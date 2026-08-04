import { customersApi } from '../../customers/api/customersApi';

const STORAGE_KEY = 'kotyol_erp_leads';

const seedLeads = [
  { id: 'lead_1', fullName: 'Alijon Valiev', phone: '+998 90 123 45 67', email: 'alijon@mail.com', companyName: 'Grand-Auto MCHJ', status: 'NEW', source: 'Telegram', notes: "Kotyol K-50kW bo'yicha qiziqdi.", nextContactDate: new Date().toISOString().split('T')[0], assignedEmployeeId: '', assignedEmployeeName: '', createdDate: '2026-08-01' },
  { id: 'lead_2', fullName: 'Zafar Karimov', phone: '+998 94 999 88 77', email: 'zafar@karimov.uz', companyName: 'Zafar Trans', status: 'CONTACTED', source: 'Telefon', notes: "Narxlar va o'rnatish shartlarini so'radi.", nextContactDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], assignedEmployeeId: '', assignedEmployeeName: '', createdDate: '2026-08-02' },
  { id: 'lead_3', fullName: 'Shahnoza Karimova', phone: '+998 93 111 22 33', email: 'shahnoza@textile.com', companyName: 'Bukhara Textile', status: 'OFFER', source: 'Tavsiya', notes: 'Tijorat taklifi yuborilgan. Tasdiqlash kutilmoqda.', nextContactDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], assignedEmployeeId: '', assignedEmployeeName: '', createdDate: '2026-08-03' },
  { id: 'lead_4', fullName: 'Sherzod Asadov', phone: '+998 97 777 55 44', email: '', companyName: 'Sher-Stroy', status: 'LOST', source: 'Facebook', notes: 'Narx juda qimmat dedi.', nextContactDate: '', assignedEmployeeId: '', assignedEmployeeName: '', createdDate: '2026-08-01' }
];

const getStoredLeads = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedLeads));
  return seedLeads;
};

const saveLeads = (leads) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
};

export const leadsApi = {
  getLeads: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredLeads());
      }, 300);
    });
  },

  getLeadById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const leads = getStoredLeads();
        const lead = leads.find(l => l.id === id);
        if (lead) resolve(lead);
        else reject(new Error('Lid topilmadi'));
      }, 300);
    });
  },

  createLead: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leads = getStoredLeads();
        const newLead = {
          ...data,
          id: 'lead_' + Date.now(),
          createdDate: new Date().toISOString().split('T')[0]
        };
        leads.push(newLead);
        saveLeads(leads);
        resolve(newLead);
      }, 300);
    });
  },

  updateLead: async (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const leads = getStoredLeads();
        const index = leads.findIndex(l => l.id === id);
        if (index === -1) return reject(new Error('Lid topilmadi'));
        leads[index] = { ...leads[index], ...data };
        saveLeads(leads);
        resolve(leads[index]);
      }, 300);
    });
  },

  deleteLead: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let leads = getStoredLeads();
        if (!leads.find(l => l.id === id)) return reject(new Error('Lid topilmadi'));
        leads = leads.filter(l => l.id !== id);
        saveLeads(leads);
        resolve(true);
      }, 300);
    });
  },

  convertLeadToCustomer: async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const leads = getStoredLeads();
        const index = leads.findIndex(l => l.id === id);
        if (index === -1) return reject(new Error('Lid topilmadi'));
        
        const lead = leads[index];
        
        await customersApi.createCustomer({
          name: lead.companyName || lead.fullName,
          phone: lead.phone,
          email: lead.email,
          customerTypeId: 'ct_1',
          region: 'Toshkent',
          status: 'ACTIVE',
          notes: `Liddan aylantirildi. Izoh: ${lead.notes}`,
        });

        leads[index].status = 'WON';
        saveLeads(leads);
        
        resolve(leads[index]);
      } catch (error) {
        reject(error);
      }
    });
  }
};
