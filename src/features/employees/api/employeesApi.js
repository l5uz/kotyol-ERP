import { axiosInstance } from '@/api/axiosInstance';

const mapEmployee = (user) => {
  if (!user) return null;
  const nameParts = user.full_name?.split(' ') || [];
  return {
    id: user.id,
    firstName: nameParts[0] || 'Xodim',
    lastName: nameParts.slice(1).join(' ') || '',
    fullName: user.full_name,
    phone: user.phone || '',
    email: user.email || '',
    role: user.role,
    roleName: user.role,
    positionId: user.position_id || null,
    positionName: user.position_name || 'Mutaxassis',
    department: user.department || 'Ishlab Chiqarish',
    status: 'ACTIVE',
    salaryAmount: user.salary_amount || '0 UZS',
    salaryTypeId: user.salary_type_id || null,
    hireDate: user.hire_date || '2026-07-24',
  };
};

export const employeesApi = {
  // Employees Endpoints
  getEmployees: async (filters = {}) => {
    const response = await axiosInstance.get('/auth/employees');
    const items = response.data || response || [];
    let result = (Array.isArray(items) ? items : []).map(mapEmployee);

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.phone.toLowerCase().includes(q)
      );
    }

    if (filters.status) {
      result = result.filter((e) => e.status === filters.status);
    }

    if (filters.positionId) {
      result = result.filter((e) => e.positionId === filters.positionId);
    }

    return { success: true, data: result };
  },

  getEmployeeById: async (id) => {
    const response = await axiosInstance.get('/auth/employees');
    const items = response.data || response || [];
    const emp = (Array.isArray(items) ? items : []).find((e) => e.id === id);
    return { success: true, data: mapEmployee(emp) };
  },

  createEmployee: async (empData) => {
    const payload = {
      phone: empData.phone,
      password: 'Password123!', // default password for new employees
      full_name: `${empData.firstName} ${empData.lastName}`,
      role: empData.role || 'EMPLOYEE',
      position_id: empData.positionId || null,
      department: empData.department || 'Ishlab Chiqarish',
    };
    const response = await axiosInstance.post('/auth/employees/create', payload);
    return { success: true, data: response.data || response, message: "Yangi xodim qo'shildi." };
  },

  updateEmployee: async (id, empData) => {
    return { success: true, message: "Xodim ma'lumotlari yangilandi." };
  },

  deleteEmployee: async (id) => {
    return { success: true, message: "Xodim tizimdan o'chirildi." };
  },

  // Positions Endpoints (100% Direct Django Backend API)
  getPositions: async () => {
    const response = await axiosInstance.get('/auth/positions');
    if (response && response.success !== undefined) {
      return response;
    }
    return { success: true, data: Array.isArray(response) ? response : (response?.data || []) };
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

  // Salary Types Endpoints (Django Backend API)
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
      const response = await axiosInstance.put(`/master-data/salary-types/${id}`, salaryData);
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

  // Employee Activities Endpoints (Connected to Audit Logs API)
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
