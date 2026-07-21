import {
  MOCK_EMPLOYEES,
  MOCK_POSITIONS,
  MOCK_SALARY_TYPES,
  MOCK_EMPLOYEE_ACTIVITIES,
} from '../constants/employees.mock';

export const employeesApi = {
  // Employees Endpoints
  getEmployees: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 300));
    let result = [...MOCK_EMPLOYEES];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.phone.toLowerCase().includes(q) ||
          e.passportNumber.toLowerCase().includes(q)
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
    await new Promise((res) => setTimeout(res, 250));
    const emp = MOCK_EMPLOYEES.find((e) => e.id === id) || MOCK_EMPLOYEES[0];
    return { success: true, data: { ...emp } };
  },

  createEmployee: async (empData) => {
    await new Promise((res) => setTimeout(res, 400));
    const newEmp = {
      ...empData,
      id: `emp_${Date.now()}`,
      fullName: `${empData.firstName} ${empData.lastName}`,
    };
    MOCK_EMPLOYEES.unshift(newEmp);
    return { success: true, data: newEmp, message: "Yangi xodim muvaffaqiyatli saqlandi." };
  },

  updateEmployee: async (id, empData) => {
    await new Promise((res) => setTimeout(res, 400));
    const index = MOCK_EMPLOYEES.findIndex((e) => e.id === id);
    if (index !== -1) {
      MOCK_EMPLOYEES[index] = {
        ...MOCK_EMPLOYEES[index],
        ...empData,
        fullName: `${empData.firstName || MOCK_EMPLOYEES[index].firstName} ${empData.lastName || MOCK_EMPLOYEES[index].lastName}`,
      };
    }
    return { success: true, data: MOCK_EMPLOYEES[index], message: "Xodim ma'lumotlari yangilandi." };
  },

  deleteEmployee: async (id) => {
    await new Promise((res) => setTimeout(res, 350));
    const idx = MOCK_EMPLOYEES.findIndex((e) => e.id === id);
    if (idx !== -1) MOCK_EMPLOYEES.splice(idx, 1);
    return { success: true, message: "Xodim tizimdan o'chirildi." };
  },

  // Positions Endpoints (Dynamic Positions)
  getPositions: async () => {
    await new Promise((res) => setTimeout(res, 250));
    return { success: true, data: [...MOCK_POSITIONS] };
  },

  createPosition: async (posData) => {
    await new Promise((res) => setTimeout(res, 350));
    const newPos = { ...posData, id: `pos_${Date.now()}`, status: 'ACTIVE' };
    MOCK_POSITIONS.push(newPos);
    return { success: true, data: newPos, message: "Yangi lavozim yaratildi." };
  },

  // Salary Types Endpoints
  getSalaryTypes: async () => {
    await new Promise((res) => setTimeout(res, 250));
    return { success: true, data: [...MOCK_SALARY_TYPES] };
  },

  // Employee Activities Endpoints
  getEmployeeActivities: async (employeeId = null) => {
    await new Promise((res) => setTimeout(res, 250));
    let activities = [...MOCK_EMPLOYEE_ACTIVITIES];
    if (employeeId) {
      activities = activities.filter((a) => a.employeeId === employeeId);
    }
    return { success: true, data: activities };
  },
};
