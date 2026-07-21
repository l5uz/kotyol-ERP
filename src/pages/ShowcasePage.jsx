import React, { useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { Card } from '@/components/common/Card/Card';
import { Modal } from '@/components/common/Modal/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { StatCard } from '@/components/common/StatCard/StatCard';
import { FileUpload } from '@/components/common/FileUpload/FileUpload';
import { Loader } from '@/components/common/Loader/Loader';
import { Skeleton } from '@/components/common/Skeleton/Skeleton';
import { NoData } from '@/components/common/NoData/NoData';
import { ERP_ICONS } from '@/shared/icons';
import { calculateManufacturingCost } from '@/services/calculateCost.service';
import { calculateProfitMargin } from '@/services/calculateProfit.service';
import { convertCurrency } from '@/services/currencyConverter.service';
import { notifySuccess, notifyError, notifyWarning, notifyInfo } from '@/services/notification.service';

export const ShowcasePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Business Calculation Service verification
  const costCalc = calculateManufacturingCost({
    rawMaterials: [
      { quantity: 10, unitPrice: 50 },
      { quantity: 5, unitPrice: 20 },
    ],
    directLaborCost: 200,
    overheadCost: 100,
    wastePercentage: 5,
  });

  const profitCalc = calculateProfitMargin(1500, costCalc.grandTotalCost);
  const currencyCalc = convertCurrency(1000, 'USD', 'EUR');

  return (
    <div className="showcase-page animate-fade-in pb-5">
      <div className="mb-4">
        <h4 className="fw-bold text-main mb-1">ERP Tizimi UI Komponentlari Ko'rgazmasi</h4>
        <p className="text-muted-custom fs-7">
          Kotyol ERP loyihasi uchun tayyorlangan standart atomik komponentlar, holatlar va hisoblash servislari
        </p>
      </div>

      {/* Toast Notification Triggers */}
      <Card title="Tizim Bildirishnomalari (Toast Notifications)" className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          <Button variant="success" size="sm" onClick={() => notifySuccess('Amal muvaffaqiyatli bajarildi!')}>
            Muvaffaqiyatli Toast
          </Button>
          <Button variant="danger" size="sm" onClick={() => notifyError('Tarmoq so\'rovida xatolik yuz berdi!')}>
            Xatolik Toast
          </Button>
          <Button variant="warning" size="sm" onClick={() => notifyWarning('Ombor qoldig\'i kamayib bormoqda!')}>
            Ogohlantirish Toast
          </Button>
          <Button variant="info" size="sm" onClick={() => notifyInfo('A-liniya uchun yangi topshiriq tayinlandi.')}>
            Ma'lumot Toast
          </Button>
        </div>
      </Card>

      {/* Buttons Showcase */}
      <Card title="Tugmalar va Amallar (Buttons)" className="mb-4">
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Button variant="primary">Asosiy Tugma</Button>
          <Button variant="secondary">Yordamchi Tugma</Button>
          <Button variant="outline-primary">Chegaralangan Tugma</Button>
          <Button variant="danger">Xavfli Tugma</Button>
          <Button variant="primary" isLoading={true}>
            Yuklanish holati
          </Button>
          <Button variant="primary" icon={ERP_ICONS.PLUS}>
            Belgili Tugma
          </Button>
        </div>
      </Card>

      {/* Inputs & Form Controls */}
      <Card title="Forma Boshqaruv Elementlari (Form Controls)" className="mb-4">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <Input
              label="Standart Matn Maydoni"
              placeholder="Mahsulot SKU tavsifini kiriting"
              leftIcon={ERP_ICONS.SEARCH}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <Select
              label="ERP Modulini Tanlash"
              placeholder="Modulni tanlang"
              options={[
                { value: 'wh', label: 'Omborxona va Zaxiralar' },
                { value: 'prod', label: 'Ishlab Chiqarish Liniyasi' },
                { value: 'fin', label: 'Moliyaviy Hisoblar' },
              ]}
            />
          </div>
          <div className="col-12 col-md-6">
            <Input label="Validatsiya Xatoligi Maydoni" placeholder="Noto'g'ri qiymat" error="Ushbu maydon kiritilishi shart" />
          </div>
          <div className="col-12 col-md-6">
            <FileUpload label="Fayllarni ushbu zonaga tashlang yoki yuklash uchun bosing" />
          </div>
        </div>
      </Card>

      {/* Status Badges & Stat Cards */}
      <Card title="Status Nishonlari va Statistik Kartalar" className="mb-4">
        <div className="d-flex flex-wrap gap-2 mb-4">
          <StatusBadge status="APPROVED" />
          <StatusBadge status="PENDING" />
          <StatusBadge status="CANCELLED" />
          <StatusBadge status="IN_PROGRESS" />
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <StatCard title="Jami Ombor Birliklari" value="84,120 dona" trendPercentage={14.2} icon={ERP_ICONS.WAREHOUSE} />
          </div>
          <div className="col-12 col-md-4">
            <StatCard title="Bajarilgan Buyurtmalar" value="1,240 dona" trendPercentage={-3.1} icon={ERP_ICONS.PRODUCTION} />
          </div>
          <div className="col-12 col-md-4">
            <StatCard title="Umumiy Tushum" value="$842,000" trendPercentage={9.5} icon={ERP_ICONS.FINANCE} />
          </div>
        </div>
      </Card>

      {/* Global UI States */}
      <Card title="Global Tizim Holatlari (Loader, Skeleton, NoData)" className="mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-3">
            <div className="border border-custom rounded p-3 text-center">
              <h6>Yuklanish Spinneri</h6>
              <Loader size="sm" label="Ma'lumotlar yuklanmoqda..." />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="border border-custom rounded p-3">
              <h6>Skelet Yuklanishi</h6>
              <Skeleton height="20px" className="mb-2" />
              <Skeleton height="15px" width="70%" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <NoData label="Ma'lumotlar mavjud emas indikatori" />
          </div>
        </div>
      </Card>

      {/* Modals & Dialog Triggers */}
      <Card title="Modal Oyna va Tasdiqlash Muloqot Oynasi" className="mb-4">
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Test Modal Oynasini Ochish
          </Button>
          <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
            Tasdiqlash Muloqotini Ochish
          </Button>
        </div>
      </Card>

      {/* Pure Business Services Calculation Output */}
      <Card title="Biznes Mantiq Servislari Hisob-Kitob Natijasi">
        <div className="fs-7">
          <p className="mb-1">
            <strong>Ishlab chiqarish tannarxi (`calculateManufacturingCost`):</strong> Jami Tannarx = $
            {costCalc.grandTotalCost.toFixed(2)} (Xomashyo = ${costCalc.totalRawMaterialCost.toFixed(2)})
          </p>
          <p className="mb-1">
            <strong>Foyda marjasi (`calculateProfitMargin`):</strong> Yalpi Foyda = $
            {profitCalc.grossProfit.toFixed(2)} ({profitCalc.marginPercentage}% marja)
          </p>
          <p className="mb-0">
            <strong>Valyuta konvertori (`convertCurrency`):</strong> $1,000.00 USD = €
            {currencyCalc.convertedAmount} EUR
          </p>
        </div>
      </Card>

      {/* Test Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Test Modal Oynasi">
        <p className="mb-0">Ushbu modal oyna ESC tugmasi va tashqi joyni bosish xususiyatlarini qo'llab-quvvatlaydi.</p>
      </Modal>

      {/* Test Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          notifySuccess('Amal tasdiqlandi va simulyatsiya qilindi.');
          setIsConfirmOpen(false);
        }}
        title="Buyurtmani o'chirishni tasdiqlaysizmi?"
        message="Haqiqatan ham ushbu ish buyurtmasini o'chirib tashlamoqchimisiz? Ushbu amalni bekor qilib bo'lmaydi."
        isDanger={true}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
};
