import { UserRole } from '@/shared/enums';

export const MOCK_USER_PROFILE = {
  id: 'usr_admin_77',
  username: 'alex_vance',
  name: 'Alex Vance',
  email: 'alex.vance@kotyol.com',
  phone: '+998 (90) 123-45-67',
  role: UserRole.SUPER_ADMIN,
  roleCode: 'SUPER_ADMIN',
  department: "Boshqaruv apparati va operatsiyalar bo'limi",
  avatar: null,
  language: "O'zbekcha",
  currency: 'USD',
  theme: 'light',
  lastLogin: '2026-07-20 17:45:12',
  status: 'ACTIVE',
  permissions: [
    'MANAGE_USERS',
    'VIEW_FINANCE',
    'MANAGE_PRODUCTION',
    'MANAGE_WAREHOUSE',
    'MANAGE_SALES',
    'VIEW_REPORTS',
  ],
};
