import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { ROUTES } from '@/constants/routes.constants';

const SETTINGS_CARDS = [
  { title: 'Kompaniya Sozlamalari', desc: "Kompaniya nomi, manzil, rekvizitlar va logotip", path: ROUTES.PROTECTED.SETTINGS_COMPANY, icon: 'bi-building', color: 'var(--erp-primary)' },
  { title: 'Valyuta va Kurslar', desc: "Ko'p valyutali hisob va ayirboshlash kurslari", path: ROUTES.PROTECTED.SETTINGS_CURRENCY, icon: 'bi-cash-stack', color: '#10b981' },
  { title: 'Omborlar Sozlamalari', desc: 'Asosiy va qo\'shimcha sex omborlari', path: ROUTES.PROTECTED.SETTINGS_WAREHOUSE, icon: 'bi-box-seam', color: '#06b6d4' },
  { title: 'Mahsulot Kategoriyalari', desc: 'Xomashyo va tayyor mahsulotlar toifalari', path: ROUTES.PROTECTED.SETTINGS_CATEGORIES, icon: 'bi-tags', color: '#f59e0b' },
  { title: 'O\'lchov Birliklari', desc: 'Dona, Kg, Litr, Metr va hajm birliklari', path: ROUTES.PROTECTED.SETTINGS_UNITS, icon: 'bi-rulers', color: '#6366f1' },
  { title: 'Xarajat Turlari', desc: 'Operatsion va ma\'muriy xarajat toifalari', path: ROUTES.PROTECTED.SETTINGS_EXPENSE_TYPES, icon: 'bi-receipt', color: '#ec4899' },
  { title: 'Defekt Sabablari', desc: 'Ombor brak va nuqsonlar ro\'yxati', path: ROUTES.PROTECTED.SETTINGS_DEFECT_REASONS, icon: 'bi-exclamation-triangle', color: '#ef4444' },
  { title: 'Servis Turlari', desc: 'Uskunalar diagnostikasi va ta\'mir turlari', path: ROUTES.PROTECTED.SETTINGS_SERVICE_TYPES, icon: 'bi-wrench', color: '#8b5cf6' },
  { title: 'Kafolat Turlari', desc: 'Sanoat va zavod kafolatlari muddatlari', path: ROUTES.PROTECTED.SETTINGS_WARRANTY_TYPES, icon: 'bi-shield-check', color: '#14b8a6' },
  { title: 'Sug\'urta Turlari', desc: 'Yuk va sanoat xavflari sug\'urtalari', path: ROUTES.PROTECTED.SETTINGS_INSURANCE_TYPES, icon: 'bi-file-earmark-medical', color: '#3b82f6' },
  { title: 'Texnologik Bosqichlar', desc: 'Ishlab chiqarish zanjiri va Drag & Drop tartib', path: ROUTES.PROTECTED.SETTINGS_PRODUCTION_STAGES, icon: 'bi-diagram-3', color: '#f97316' },
  { title: 'Rollar va Lavozimlar', desc: 'Tizim lavozimlari va foydalanuvchilar soni', path: ROUTES.PROTECTED.SETTINGS_ROLES, icon: 'bi-person-badge', color: '#84cc16' },
  { title: 'Ruxsatlar Matritsasi', desc: 'Modullar bo\'yicha amallar va kirish huquqlari', path: ROUTES.PROTECTED.SETTINGS_PERMISSIONS, icon: 'bi-lock', color: '#a855f7' },
];

export const SettingsPage = () => {
  return (
    <div className="settings-hub-page animate-fade-in pb-5">
      <SettingsSubNav />

      <PageHeader
        title="Tizim Sozlamalari Boshqaruvi (Settings Hub)"
        subtitle="Kotyol ERP tizimining barcha bo'lajak modullari (Ombor, Ishlab chiqarish, Sotuv, Moliya, HR) uchun standart parametrlarni sozlang."
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Sozlamalar' },
        ]}
      />

      <div className="row g-3">
        {SETTINGS_CARDS.map((card) => (
          <div key={card.path} className="col-12 col-sm-6 col-lg-4">
            <Link to={card.path} className="text-decoration-none">
              <Card className="h-100 p-3 hover-shadow border-custom transition-all">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 p-3 text-white d-flex align-items-center justify-content-center"
                    style={{ width: '48px', height: '48px', backgroundColor: card.color }}
                  >
                    <i className={`bi ${card.icon} fs-4`}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-main mb-1">{card.title}</h6>
                    <small className="text-muted-custom fs-8 d-block">{card.desc}</small>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
