import { MOCK_USER_PROFILE } from '../constants/auth.mock';

export const authApi = {
  login: async ({ username, password, rememberMe }) => {
    // Simulated async network request to backend /auth/login
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!username || !password) {
      throw new Error('Foydalanuvchi nomi va parol kiritilishi shart');
    }

    if (password.length < 6) {
      throw new Error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
    }

    return {
      success: true,
      user: {
        ...MOCK_USER_PROFILE,
        username,
      },
      accessToken: 'mock_jwt_access_token_xyz987654321',
      refreshToken: 'mock_jwt_refresh_token_abc123456789',
      expiresIn: 3600,
    };
  },

  forgotPassword: async (identifier) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!identifier) {
      throw new Error("Foydalanuvchi nomi yoki email kiritilishi shart");
    }

    return {
      success: true,
      message: "Parolni tiklash yo'riqnomasi ko'rsatilgan email manziliga yuborildi.",
    };
  },

  changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("Barcha parol maydonlari to'ldirilishi shart");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Yangi parol va tasdiqlash paroli mos kelmadi");
    }

    if (newPassword.length < 6) {
      throw new Error("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
    }

    return {
      success: true,
      message: "Parol muvaffaqiyatli o'zgartirildi.",
    };
  },

  updateProfile: async (updates) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      user: { ...MOCK_USER_PROFILE, ...updates },
      message: "Profil ma'lumotlari muvaffaqiyatli yangilandi.",
    };
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
};
