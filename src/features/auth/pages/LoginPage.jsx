import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { notifySuccess } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';
import { ERP_ICONS } from '@/shared/icons';

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    setErrorMessage('');
    try {
      await login({
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      notifySuccess('Xush kelibsiz! Tizimga muvaffaqiyatli kirildi.');
      navigate(ROUTES.PROTECTED.DASHBOARD);
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;
      
      if (status === 404 && detail === 'USER_NOT_FOUND') {
        setErrorMessage("Bu raqam bilan akkount topilmadi. Iltimos, avval ro'yxatdan o'ting.");
        setTimeout(() => navigate(`/register?phone=${encodeURIComponent(data.username)}`), 1500);
        return;
      }
      
      setErrorMessage(detail || err.message || "Tizimga kirishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="auth-login-container text-start animate-fade-in">
      <div className="text-center mb-3">
        <h4 className="fw-bold text-main mb-1">Tizimga kirish</h4>
        <p className="text-muted-custom fs-7">Ishlab chiqarish korxonasi portali</p>
      </div>

      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 fs-7 mb-3" role="alert">
          <i className={`bi ${ERP_ICONS.EXCLAMATION} fs-5`}></i>
          <div>{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Telefon raqam maydoni */}
        <div className="mb-3">
          <label className="form-label fs-7 fw-medium text-main">
            Telefon raqami
          </label>
          <div className="input-group">
            <span className="input-group-text bg-body-custom border-custom text-muted-custom">
              <i className="bi bi-telephone-fill"></i>
            </span>
            <input
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              placeholder="+998901234567"
              {...register('username', { required: "Telefon raqami kiritilishi shart" })}
            />
            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
          </div>
        </div>

        {/* Password field with Show/Hide toggle */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label fs-7 fw-medium text-main mb-0">Parol</label>
            <Link to={ROUTES.PUBLIC.FORGOT_PASSWORD} className="text-primary fs-8 fw-medium text-decoration-none">
              Parolni unutdingizmi?
            </Link>
          </div>
          <div className="input-group">
            <span className="input-group-text bg-body-custom border-custom text-muted-custom">
              <i className="bi bi-lock-fill"></i>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('password', { required: "Parol kiritilishi shart" })}
            />
            <button
              type="button"
              className="btn btn-outline-secondary border-custom text-muted-custom"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Parolni berkitish" : "Parolni ko'rsatish"}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
            </button>
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberMe"
            defaultChecked
            {...register('rememberMe')}
          />
          <label className="form-check-label fs-7 text-muted-custom" htmlFor="rememberMe">
            Meni tizimda eslab qolish
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Tekshirilmoqda...</span>
            </>
          ) : (
            <>
              <i className={`bi ${ERP_ICONS.LOGOUT}`}></i>
              <span>Tizimga kirish</span>
            </>
          )}
        </button>
      </form>
      <div className="text-center mt-3">
        <span className="text-muted-custom fs-8">Tashkilotingiz yo'qmi? </span>
        <Link to="/register" className="text-primary fs-8 fw-medium text-decoration-none">
          Ro'yxatdan o'tish
        </Link>
      </div>
    </div>
  );
};
