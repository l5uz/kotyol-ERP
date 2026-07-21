import React from 'react';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '@/constants/app.constants';

export const AuthLayout = () => {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-body-custom p-3">
      <div className="text-center mb-4 animate-fade-in">
        <div className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary text-white p-3 mb-2 shadow-sm">
          <i className="bi bi-gear-wide-connected fs-2"></i>
        </div>
        <h3 className="fw-bold text-main mb-1">{APP_NAME}</h3>
        <p className="text-muted-custom fs-7">Ishlab chiqarishni boshqarish bo'yicha korxona platformasi</p>
      </div>

      <div className="w-100" style={{ maxWidth: '440px' }}>
        <div className="card shadow-lg border-custom p-4 animate-fade-in">
          <Outlet />
        </div>
      </div>

      <div className="mt-4 text-center text-muted-custom fs-8">
        &copy; {new Date().getFullYear()} Kotyol Enterprise ERP. Barcha huquqlar himoyalangan.
      </div>
    </div>
  );
};
