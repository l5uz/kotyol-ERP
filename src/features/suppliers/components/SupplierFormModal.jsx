import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { Button } from '@/components/common/Button/Button';

export const SupplierFormModal = ({ isOpen, onClose, onSubmit, supplier = null }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    tin: '',
    status: 'ACTIVE',
    notes: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        companyName: supplier.companyName || '',
        contactPerson: supplier.contactPerson || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        tin: supplier.tin || '',
        status: supplier.status || 'ACTIVE',
        notes: supplier.notes || '',
      });
    } else {
      setFormData({
        companyName: '',
        contactPerson: '',
        phone: '+998 ',
        email: '',
        address: '',
        tin: '',
        status: 'ACTIVE',
        notes: '',
      });
    }
  }, [supplier, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier ? "Ta'minotchi Ma'lumotlarini Tahrirlash" : "Yangi Ta'minotchi Qo'shish"}
      size="lg"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {supplier ? 'Saqlash' : "Qo'shish"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <Input
              label="Ta'minotchi Korxona Nomi"
              placeholder="Toshkent Po'lat Sanoat MCHJ"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Mas'ul Shaxs (Contact Person)"
              placeholder="Akmal Karimov"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Telefon Raqami"
              placeholder="+998 71 234 56 78"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Email Manzili"
              placeholder="info@supplier.uz"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="STIR / TIN Raqami"
              placeholder="302987654"
              value={formData.tin}
              onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'ACTIVE', label: 'Faol' },
                { value: 'INACTIVE', label: 'Nofaol' },
              ]}
            />
          </div>
          <div className="col-12">
            <Input
              label="Yuridik va Ombor Manzili"
              placeholder="Toshkent viloyati, Chirchiq sanoat zonasi"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label fs-7 fw-medium text-main">Qo'shimcha Izoh va Shartnoma Shartlari</label>
            <textarea
              className="form-control fs-7"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Yetkazish muddatlari, shartnoma raqami..."
            ></textarea>
          </div>
        </div>
      </form>
    </Modal>
  );
};
