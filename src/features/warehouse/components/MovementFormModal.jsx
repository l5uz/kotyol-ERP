import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { DynamicSelect } from '@/components/common/DynamicSelect/DynamicSelect';
import { Button } from '@/components/common/Button/Button';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { ROUTES } from '@/constants/routes.constants';

export const MovementFormModal = ({ isOpen, onClose, onSubmit, products = [] }) => {
  const [movementTypeOptions, setMovementTypeOptions] = useState(dynamicSettingsService.getMovementTypeOptions());
  const [movementReasonOptions, setMovementReasonOptions] = useState(dynamicSettingsService.getMovementReasonOptions());
  const [warehouseOptions, setWarehouseOptions] = useState(dynamicSettingsService.getWarehouseOptions());
  const productOptions = products.map((p) => ({ value: p.id || p.productId, label: p.productName || p.name }));

  const [formData, setFormData] = useState({
    productId: productOptions[0]?.value || '',
    warehouseId: warehouseOptions[0]?.value || '',
    movementTypeCode: movementTypeOptions[0]?.value || 'PURCHASE',
    reason: movementReasonOptions[0]?.value || '',
    quantity: '100',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        productId: productOptions[0]?.value || '',
        warehouseId: warehouseOptions[0]?.value || '',
        movementTypeCode: movementTypeOptions[0]?.value || 'PURCHASE',
        reason: movementReasonOptions[0]?.value || '',
        quantity: '100',
        notes: '',
      });
    }
  }, [isOpen]);

  const handleAddNewWarehouse = (newRecord) => {
    const newWH = { value: `wh_${Date.now()}`, label: newRecord.name };
    setWarehouseOptions((prev) => [...prev, newWH]);
    setFormData((prev) => ({ ...prev, warehouseId: newWH.value }));
    return newWH;
  };

  const handleAddNewReason = (newRecord) => {
    const newReas = { value: newRecord.name, label: newRecord.name };
    setMovementReasonOptions((prev) => [...prev, newReas]);
    setFormData((prev) => ({ ...prev, reason: newReas.value }));
    return newReas;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedProd = products.find((p) => (p.id || p.productId) === formData.productId);
    const selectedMType = movementTypeOptions.find((m) => m.value === formData.movementTypeCode);
    const selectedWH = warehouseOptions.find((w) => w.value === formData.warehouseId);

    onSubmit({
      ...formData,
      productName: selectedProd ? (selectedProd.productName || selectedProd.name) : '',
      unitName: selectedProd ? selectedProd.unitName : 'dona',
      movementTypeName: selectedMType ? selectedMType.label : '',
      warehouseName: selectedWH ? selectedWH.label : '',
      quantity: parseFloat(formData.quantity) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yangi Ombor Harakatini Kiritish"
      size="lg"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Harakatni Saqlash
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <Select
              label="Mahsulot / Xomashyo"
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              options={productOptions}
            />
          </div>

          {/* Dynamic Warehouse Select */}
          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Omborxona"
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              options={warehouseOptions}
              managePath={ROUTES.PROTECTED.SETTINGS_WAREHOUSE}
              onAddNew={handleAddNewWarehouse}
              entityTitle="Ombor"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <Select
              label="Harakat Turi"
              value={formData.movementTypeCode}
              onChange={(e) => setFormData({ ...formData, movementTypeCode: e.target.value })}
              options={movementTypeOptions}
            />
          </div>

          {/* Dynamic Movement Reason Select */}
          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Harakat Sababi"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              options={movementReasonOptions}
              managePath={ROUTES.PROTECTED.SETTINGS}
              onAddNew={handleAddNewReason}
              entityTitle="Harakat Sababi"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <Input
              label="Miqdori"
              placeholder="100"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label fs-7 fw-medium text-main">Operatsiya Bo'yicha Izoh</label>
            <textarea
              className="form-control fs-7"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Shartnoma raqami yoki ish topshirig'i ma'lumoti..."
            ></textarea>
          </div>
        </div>
      </form>
    </Modal>
  );
};
