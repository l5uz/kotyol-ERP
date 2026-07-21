import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '+998 (90) 123-45-67');
  const [email, setEmail] = useState(user?.email || 'alex.vance@kotyol.com');
  const [department, setDepartment] = useState(user?.department || "Boshqaruv apparati");

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({ phone, email, department });
    notifySuccess("Profil ma'lumotlari muvaffaqiyatli saqlandi.");
    setIsEditModalOpen(false);
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Foydalanuvchi Profili</h4>
          <p className="text-muted-custom fs-7 mb-0">Shaxsiy ma'lumotlar va tizim sozlamalari</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PENCIL} onClick={() => setIsEditModalOpen(true)}>
          Profilni Tahrirlash
        </Button>
      </div>

      <div className="row g-4">
        {/* Profile Card Header */}
        <div className="col-12 col-lg-4">
          <Card className="text-center p-3">
            <div
              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold display-5 mb-3 mx-auto shadow-sm"
              style={{ width: '96px', height: '96px' }}
            >
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <h5 className="fw-bold text-main mb-1">{user?.name || 'Alex Vance'}</h5>
            <p className="text-muted-custom fs-7 mb-2">@{user?.username || 'alex_vance'}</p>
            <div className="mb-3">
              <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2">
                {user?.role || 'Bosh administrator'}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span className="fs-8 text-muted-custom">Hisob holati:</span>
              <StatusBadge status={user?.status || 'ACTIVE'} />
            </div>
          </Card>
        </div>

        {/* Profile Details List */}
        <div className="col-12 col-lg-8">
          <Card title="Batafsil Foydalanuvchi Ma'lumotlari">
            <div className="row g-3 fs-7">
              <div className="col-12 col-sm-6">
                <label className="text-muted-custom fs-8 d-block mb-1">Foydalanuvchi nomi</label>
                <div className="fw-semibold text-main">{user?.username}</div>
              </div>
              <div className="col-12 col-sm-6">
                <label className="text-muted-custom fs-8 d-block mb-1">Email manzili</label>
                <div className="fw-semibold text-main">{user?.email}</div>
              </div>
              <div className="col-12 col-sm-6">
                <label className="text-muted-custom fs-8 d-block mb-1">Telefon raqami</label>
                <div className="fw-semibold text-main">{user?.phone}</div>
              </div>
              <div className="col-12 col-sm-6">
                <label className="text-muted-custom fs-8 d-block mb-1">Bo'lim va Lavozim</label>
                <div className="fw-semibold text-main">{user?.department}</div>
              </div>
              <div className="col-12 col-sm-6">
                <label className="text-muted-custom fs-8 d-block mb-1">Tizim tili</label>
                <div className="fw-semibold text-main">{user?.language || "O'zbekcha"}</div>
              </div>
              <div className="col-12 col-sm-6">
                <label className="text-muted-custom fs-8 d-block mb-1">Asosiy Valyuta</label>
                <div className="fw-semibold text-main">{user?.currency || 'USD ($)'}</div>
              </div>
              <div className="col-12 col-sm-6">
                <label className="text-muted-custom fs-8 d-block mb-1">Oxirgi kirish vaqti</label>
                <div className="fw-semibold text-main">{user?.lastLogin || '2026-07-20 17:45:12'}</div>
              </div>
              <div className="col-12 col-sm-6">
                <label className="text-muted-custom fs-8 d-block mb-1">Tizim Huquqlari (Permissions)</label>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {(user?.permissions || ['MANAGE_USERS', 'VIEW_FINANCE']).map((perm) => (
                    <span key={perm} className="badge bg-secondary bg-opacity-10 text-secondary fs-8">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Profil Ma'lumotlarini Tahrirlash"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Saqlash
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <Input label="Email manzili" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Telefon raqami" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Bo'lim va strukturasi" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </form>
      </Modal>
    </div>
  );
};
