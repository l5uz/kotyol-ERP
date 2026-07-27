import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { DynamicSelect } from '@/components/common/DynamicSelect/DynamicSelect';
import { Button } from '@/components/common/Button/Button';
import { FileUpload } from '@/components/common/FileUpload/FileUpload';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { ROUTES } from '@/constants/routes.constants';

export const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  employee = null,
  positions = [],
  salaryTypes = [],
}) => {
  const [roleOptions, setRoleOptions] = useState(dynamicSettingsService.getRoleOptions());
  const [localPositions, setLocalPositions] = useState(positions);

  useEffect(() => {
    setLocalPositions(positions);
  }, [positions]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    passportNumber: '',
    positionId: '',
    role: roleOptions[0]?.value || 'Administrator',
    salaryTypeId: '',
    salaryAmount: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    notes: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        phone: employee.phone || '',
        email: employee.email || '',
        passportNumber: employee.passportNumber || '',
        positionId: employee.positionId || (localPositions[0]?.id || ''),
        role: employee.role || (roleOptions[0]?.value || 'Administrator'),
        salaryTypeId: employee.salaryTypeId || (salaryTypes[0]?.id || ''),
        salaryAmount: employee.salaryAmount || '',
        hireDate: employee.hireDate || new Date().toISOString().split('T')[0],
        status: employee.status || 'ACTIVE',
        notes: employee.notes || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        phone: '+998 ',
        email: '',
        passportNumber: '',
        positionId: localPositions[0]?.id || '',
        role: roleOptions[0]?.value || 'Administrator',
        salaryTypeId: salaryTypes[0]?.id || '',
        salaryAmount: '',
        hireDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        notes: '',
      });
    }
  }, [employee, localPositions, salaryTypes, isOpen]);

  const handleAddNewPosition = (newRecord) => {
    const newPos = {
      id: `pos_${Date.now()}`,
      name: newRecord.name,
      description: newRecord.description || '',
    };
    setLocalPositions((prev) => [...prev, newPos]);
    setFormData((prev) => ({ ...prev, positionId: newPos.id }));
    return { value: newPos.id, label: newPos.name };
  };

  const handleAddNewRole = (newRecord) => {
    const newRole = { value: newRecord.name, label: newRecord.name };
    setRoleOptions((prev) => [...prev, newRole]);
    setFormData((prev) => ({ ...prev, role: newRole.value }));
    return newRole;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedPos = localPositions.find((p) => p.id === formData.positionId);
    const selectedSal = salaryTypes.find((s) => s.id === formData.salaryTypeId);

    onSubmit({
      ...formData,
      positionName: selectedPos ? selectedPos.name : '',
      salaryTypeName: selectedSal ? selectedSal.name : '',
      salaryAmount: parseFloat(formData.salaryAmount) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? "Xodim Ma'lumotlarini Tahrirlash" : "Yangi Xodim Qo'shish"}
      size="lg"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {employee ? 'Saqlash' : "Qo'shish"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <Input
              label="Ismi"
              placeholder="Jasur"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Familiyasi"
              placeholder="Nazarov"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Telefon Raqami"
              placeholder="+998 90 123 45 67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Email Manzili"
              placeholder="jasur.n@kotyol.uz"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Pasport / ID Seriyasi"
              placeholder="AA 1234567"
              value={formData.passportNumber}
              onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
              required
            />
          </div>

          {/* Dynamic Position Selector */}
          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Lavozimi"
              value={formData.positionId}
              onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
              options={localPositions.map((p) => ({ value: p.id, label: p.name }))}
              managePath={ROUTES.PROTECTED.EMPLOYEES_POSITIONS}
              onAddNew={handleAddNewPosition}
              entityTitle="Lavozim"
              required
            />
          </div>

          {/* Dynamic Role Selector */}
          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Tizim Roli"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={roleOptions}
              managePath={ROUTES.PROTECTED.SETTINGS_ROLES}
              onAddNew={handleAddNewRole}
              entityTitle="Tizim Roli"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <Select
              label="Oylik Maosh Turi"
              value={formData.salaryTypeId}
              onChange={(e) => setFormData({ ...formData, salaryTypeId: e.target.value })}
              options={salaryTypes.map((s) => ({ value: s.id, label: s.name }))}
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Maosh Stavkasi Summasi ($)"
              placeholder="1200.00"
              type="number"
              value={formData.salaryAmount}
              onChange={(e) => setFormData({ ...formData, salaryAmount: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Ishga Kirgan Sana"
              type="date"
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
            />
          </div>
          <div className="col-12 col-md-6">
            <Select
              label="Xodim Statusi"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'ACTIVE', label: 'Faol' },
                { value: 'ON_LEAVE', label: 'Ta\'tilda' },
                { value: 'SICK_LEAVE', label: 'Kasallik Ta\'tili' },
                { value: 'TERMINATED', label: 'Bo\'shatilgan' },
              ]}
            />
          </div>
          <div className="col-12">
            <label className="form-label fs-7 fw-medium text-main">Xodim Haqida Qo'shimcha Izoh</label>
            <textarea
              className="form-control fs-7"
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Malaka darajasi, maxsus sertifikatlari..."
            ></textarea>
          </div>
          <div className="col-12">
            <label className="form-label fs-7 fw-medium text-main">Xodim Rasmi (Avatar)</label>
            <FileUpload label="Xodim suratini yuklash" maxSizeMB={2} />
          </div>
        </div>
      </form>
    </Modal>
  );
};
