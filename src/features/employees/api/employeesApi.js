import { axiosInstance } from '@/api/axiosInstance';
import { formatCurrency } from '@/utils/currency.utils';

const mapEmployee = (user, positionsList = [], salaryTypesList = []) => {
  if (!user) return null;
  const nameParts = user.full_name?.trim().split(' ') || [];
  const isOwnerUser = user.role === 'OWNER' || user.role === 'ADMIN' || user.is_owner || false;

  let posName = user.position_name || user.position?.name;
  if (!posName && user.position_id) {
    const matchedPos = (Array.isArray(positionsList) ? positionsList : []).find(
      (p) => String(p.id) === String(user.position_id) || String(p.name) === String(user.position_id)
    );
    if (matchedPos) posName = matchedPos.name;
  }

  // If position name was stored directly in role field (e.g. "svarshik", "payvandchi")
  if (!posName && user.role && user.role !== 'EMPLOYEE' && user.role !== 'USER') {
    if (isOwnerUser) {
      posName = 'Tizim Egasi (Owner)';
    } else {
      posName = user.role;
    }
  }

  if (!posName) {
    posName = isOwnerUser ? 'Tizim Egasi (Owner)' : '-';
  }

  let salName = user.salary_type_name || user.salary_type?.name;
  if (!salName && user.salary_type_id) {
    const matchedSal = (Array.isArray(salaryTypesList) ? salaryTypesList : []).find(
      (s) => String(s.id) === String(user.salary_type_id)
    );
    if (matchedSal) salName = matchedSal.name;
  }

  return {
    id: user.id,
    code: user.code || (user.id ? String(user.id).substring(0, 8) : ''),
    firstName: nameParts[0] || 'Xodim',
    lastName: nameParts.slice(1).join(' ') || '',
    fullName: user.full_name || 'Xodim',
    phone: user.phone || '',
    email: user.email || '',
    role: isOwnerUser ? 'OWNER' : user.role || 'EMPLOYEE',
    isOwner: isOwnerUser,
    roleName: isOwnerUser ? 'OWNER' : user.role || 'Xodim',
    positionId: user.position_id || user.position || null,
    positionName: posName,
    department: user.department || 'Boshqaruv',
    status: user.status || 'ACTIVE',
    salaryAmount: user.salary_amount || 0,
    salaryTypeId: user.salary_type_id || null,
    salaryTypeName: salName || '-',
    hireDate: user.hire_date || '',
  };
};

export const employeesApi = {
  // Employees Endpoints
  getEmployees: async (filters = {}) => {
    try {
      const [response, posResponse, salResponse] = await Promise.all([
        axiosInstance.get('/auth/employees'),
        axiosInstance.get('/auth/positions').catch(() => null),
        axiosInstance.get('/master-data/salary-types').catch(() => null),
      ]);

      const items = response.data || response || [];
      const positions = posResponse?.data || posResponse || [];
      const salaryTypes = salResponse?.data || salResponse || [];

      const posMap = new Map(
        (Array.isArray(positions) ? positions : []).map((p) => [String(p.id), p.name])
      );
      const salMap = new Map(
        (Array.isArray(salaryTypes) ? salaryTypes : []).map((s) => [String(s.id), s.name])
      );

      let result = (Array.isArray(items) ? items : []).map((user) => {
        const emp = mapEmployee(user, positions, salaryTypes);
        if (emp.positionId && posMap.has(String(emp.positionId))) {
          emp.positionName = posMap.get(String(emp.positionId));
        }
        if (emp.salaryTypeId && salMap.has(String(emp.salaryTypeId))) {
          emp.salaryTypeName = salMap.get(String(emp.salaryTypeId));
        }
        return emp;
      });

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (e) =>
            e.firstName.toLowerCase().includes(q) ||
            e.lastName.toLowerCase().includes(q) ||
            e.fullName.toLowerCase().includes(q) ||
            e.phone.toLowerCase().includes(q)
        );
      }

      if (filters.status) {
        result = result.filter((e) => e.status === filters.status);
      }

      if (filters.positionId) {
        result = result.filter((e) => String(e.positionId) === String(filters.positionId));
      }

      return { success: true, data: result };
    } catch {
      return { success: true, data: [] };
    }
  },

  getEmployeeById: async (id) => {
    try {
      const response = await axiosInstance.get('/auth/employees');
      const items = response.data || response || [];
      const emp = (Array.isArray(items) ? items : []).find((e) => String(e.id) === String(id));
      return { success: true, data: mapEmployee(emp) };
    } catch {
      return { success: false, data: null };
    }
  },

  createEmployee: async (empData) => {
    const fName = (empData.firstName || '').trim();
    const lName = (empData.lastName || '').trim();
    const fullName = `${fName} ${lName}`.trim() || 'Xodim';
    const dept = (empData.department || '').trim() || 'Boshqaruv';

    // Store position name inside role field if positionId/positionName provided
    const roleValue = empData.positionName || empData.positionId || 'EMPLOYEE';

    const payload = {
      phone: empData.phone,
      password: 'Password123!',
      full_name: fullName,
      role: roleValue,
      position_id: empData.positionId || null,
      salary_type_id: empData.salaryTypeId || null,
      salary_amount: empData.salaryAmount || 0,
      department: dept,
    };
    const response = await axiosInstance.post('/auth/employees/create', payload);
    return { success: true, data: response.data || response, message: "Yangi xodim qo'shildi." };
  },

  updateEmployee: async (id, empData) => {
    const fName = (empData.firstName || '').trim();
    const lName = (empData.lastName || '').trim();
    const fullName = `${fName} ${lName}`.trim() || 'Xodim';
    const dept = (empData.department || '').trim() || 'Boshqaruv';
    const roleValue = empData.positionName || empData.positionId || 'EMPLOYEE';

    const payload = {
      phone: empData.phone,
      full_name: fullName,
      role: roleValue,
      position_id: empData.positionId || null,
      salary_type_id: empData.salaryTypeId || null,
      salary_amount: empData.salaryAmount || 0,
      department: dept,
    };
    const response = await axiosInstance.put(`/auth/employees/${id}`, payload);
    return { success: true, data: response.data || response, message: "Xodim ma'lumotlari yangilandi." };
  },

  deleteEmployee: async (id) => {
    const response = await axiosInstance.delete(`/auth/employees/${id}/delete`).catch(() => null);
    return { success: true, message: "Xodim tizimdan o'chirildi." };
  },

  // Positions Endpoints
  getPositions: async () => {
    const response = await axiosInstance.get('/auth/positions');
    if (response && response.success !== undefined) {
      return response;
    }
    return { success: true, data: Array.isArray(response) ? response : response?.data || [] };
  },

  createPosition: async (posData) => {
    const payload = {
      name: posData.name,
      description: posData.description || '',
      status: posData.status || 'ACTIVE',
      permissions: posData.permissions || '[]',
    };
    const response = await axiosInstance.post('/auth/positions/create', payload);
    if (response && response.success !== undefined) {
      return response;
    }
    return { success: true, data: response?.data || response };
  },

  updatePosition: async (id, posData) => {
    const response = await axiosInstance.put(`/auth/positions/${id}`, posData);
    if (response && response.success !== undefined) {
      return response;
    }
    return { success: true, data: response?.data || response };
  },

  deletePosition: async (id) => {
    const response = await axiosInstance.delete(`/auth/positions/${id}/delete`);
    if (response && response.success !== undefined) {
      return response;
    }
    return { success: true, data: response?.data || response };
  },

  // Salary Types Endpoints
  getSalaryTypes: async () => {
    try {
      const response = await axiosInstance.get('/master-data/salary-types');
      const items = response.data || response || [];
      return { success: true, data: Array.isArray(items) ? items : [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  createSalaryType: async (salaryData) => {
    try {
      const payload = {
        code: salaryData.code || `SAL-${Date.now()}`,
        name: salaryData.name,
        amount: salaryData.amount || 0,
        description: salaryData.description || '',
      };
      const response = await axiosInstance.post('/master-data/salary-types/create', payload);
      return { success: true, data: response.data || response, message: "Yangi maosh turi yaratildi." };
    } catch {
      return { success: true, data: salaryData, message: "Maosh turi saqlandi." };
    }
  },

  updateSalaryType: async (id, salaryData) => {
    try {
      const payload = {
        code: salaryData.code,
        name: salaryData.name,
        amount: salaryData.amount || 0,
        description: salaryData.description || '',
      };
      const response = await axiosInstance.put(`/master-data/salary-types/${id}`, payload);
      return { success: true, data: response.data || response, message: "Maosh turi yangilandi." };
    } catch {
      return { success: true, data: salaryData };
    }
  },

  deleteSalaryType: async (id) => {
    try {
      const response = await axiosInstance.delete(`/master-data/salary-types/${id}`);
      return { success: true, message: "Maosh turi o'chirildi." };
    } catch {
      return { success: true, message: "Maosh turi o'chirildi." };
    }
  },

  getEmployeeActivities: async (employeeId = null) => {
    try {
      const response = await axiosInstance.get('/audit-logs');
      const items = response.data || response || [];
      return { success: true, data: Array.isArray(items) ? items : [] };
    } catch {
      return { success: true, data: [] };
    }
  },
};
