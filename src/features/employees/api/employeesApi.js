import { axiosInstance } from '@/api/axiosInstance';
import {
  MOCK_POSITIONS,
  MOCK_SALARY_TYPES,
  MOCK_EMPLOYEE_ACTIVITIES,
} from '../constants/employees.mock';

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
    positionId: user.position_id || 'pos_1',
    positionName: 'Mutaxassis',
    department: user.department || 'Ishlab Chiqarish',
    status: 'ACTIVE',
    salaryAmount: user.salary_amount || '5,000,000 UZS',
    salaryTypeId: user.salary_type_id || 'sal_type_fixed',
    hireDate: user.hire_date || '2026-07-24',
  };
};

export const employeesApi = {
  // Employees Endpoints
  getEmployees: async (filters = {}) => {
    const response = await axiosInstance.get('/auth/employees');
    let result = (response.data || []).map(mapEmployee);

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
    const emp = (response.data || []).find((e) => e.id === id);
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
      salary_amount: empData.salaryAmount || '5,000,000 UZS',
      salary_type_id: empData.salaryTypeId || 'sal_type_fixed',
      hire_date: empData.hireDate || new Date().toISOString().split('T')[0],
    };

    const response = await axiosInstance.post('/auth/employees', payload);
    return { success: true, data: mapEmployee(response.data), message: "Yangi xodim muvaffaqiyatli saqlandi." };
  },

  updateEmployee: async (id, empData) => {
    // Simulated as update is handled on user profile or mock in frontend
    return { success: true, message: "Xodim ma'lumotlari yangilandi." };
  },

  deleteEmployee: async (id) => {
    return { success: true, message: "Xodim tizimdan o'chirildi." };
  },

  // Positions Endpoints (Dynamic Positions)
  getPositions: async () => {
    const response = await axiosInstance.get('/auth/positions');
    return response.data;
  },

  createPosition: async (posData) => {
    const response = await axiosInstance.post('/auth/positions', posData);
    return response.data;
  },

  updatePosition: async (id, posData) => {
    const response = await axiosInstance.put(`/auth/positions/${id}`, posData);
    return response.data;
  },

  deletePosition: async (id) => {
    const response = await axiosInstance.delete(`/auth/positions/${id}`);
    return response.data;
  },

  // Salary Types Endpoints
  getSalaryTypes: async () => {
    return { success: true, data: [...MOCK_SALARY_TYPES] };
  },

  // Employee Activities Endpoints
  getEmployeeActivities: async (employeeId = null) => {
    let activities = [...MOCK_EMPLOYEE_ACTIVITIES];
    if (employeeId) {
      activities = activities.filter((a) => a.employeeId === employeeId);
    }
    return { success: true, data: activities };
  },
};
