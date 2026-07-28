import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { DynamicSelect } from '@/components/common/DynamicSelect/DynamicSelect';
import { Button } from '@/components/common/Button/Button';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { ROUTES } from '@/constants/routes.constants';
import { LuPlus, LuListFilter } from 'react-icons/lu';

export const MovementFormModal = ({ isOpen, onClose, onSubmit, products = [] }) => {
  const [isNewProductMode, setIsNewProductMode] = useState(true);

  const [movementTypeOptions, setMovementTypeOptions] = useState(dynamicSettingsService.getMovementTypeOptions());
  const [warehouseOptions, setWarehouseOptions] = useState(dynamicSettingsService.getWarehouseOptions());
  const [unitOptions] = useState([
    { value: 'dona', label: 'dona' },
    { value: 'kg', label: 'kg' },
    { value: 'metr', label: 'metr' },
    { value: 'litr', label: 'litr' },
    { value: 'komplekt', label: 'komplekt' },
  ]);

  const productOptions = products.map((p) => ({
    value: p.id || p.productId,
    label: `${p.productName || p.name} (Hozirgi qoldiq: ${p.quantity || 0} ${p.unitName || 'dona'})`,
  }));

  const [formData, setFormData] = useState({
    customProductName: '',
    productId: productOptions[0]?.value || '',
    warehouseId: warehouseOptions[0]?.value || '',
    movementTypeCode: 'PURCHASE',
    quantity: '',
    unitName: 'dona',
    unitPrice: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        customProductName: '',
        productId: productOptions[0]?.value || '',
        warehouseId: warehouseOptions[0]?.value || '',
        movementTypeCode: 'PURCHASE',
        quantity: '',
        unitName: 'dona',
        unitPrice: '',
        notes: '',
      });
      setIsNewProductMode(true);
    }
  }, [isOpen]);

  const handleAddNewWarehouse = (newRecord) => {
    const newWH = { value: `wh_${Date.now()}`, label: newRecord.name };
    setWarehouseOptions((prev) => [...prev, newWH]);
    setFormData((prev) => ({ ...prev, warehouseId: newWH.value }));
    return newWH;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalProductName = '';
    let finalUnitName = formData.unitName;

    if (isNewProductMode) {
      if (!formData.customProductName.trim()) return;
      finalProductName = formData.customProductName.trim();
    } else {
      const selectedProd = products.find((p) => (p.id || p.productId) === formData.productId);
      finalProductName = selectedProd ? (selectedProd.productName || selectedProd.name) : 'Noma\'lum mahsulot';
      if (selectedProd?.unitName) finalUnitName = selectedProd.unitName;
    }

    const selectedMType = movementTypeOptions.find((m) => m.value === formData.movementTypeCode);
    const selectedWH = warehouseOptions.find((w) => w.value === formData.warehouseId);

    onSubmit({
      ...formData,
      productName: finalProductName,
      unitName: finalUnitName,
      movementTypeName: selectedMType ? selectedMType.label : 'Kirim',
      warehouseName: selectedWH ? selectedWH.label : 'Asosiy Ombor',
      quantity: parseFloat(formData.quantity) || 0,
      unitPrice: parseFloat(formData.unitPrice) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Omborga Mahsulot Kirim Qilish"
      size="lg"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Mahsulotni Omborga Saqlash
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Toggle Mode Segment */}
        <div className="d-flex align-items-center justify-content-between p-2 bg-body-custom rounded-3 border-custom mb-3">
          <span className="fs-8 fw-semibold text-muted-custom">Kirim Usulini Tanlang:</span>
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${isNewProductMode ? 'btn-primary' : 'btn-outline-secondary'} fs-8`}
              onClick={() => setIsNewProductMode(true)}
            >
              <LuPlus className="me-1" /> Yangi Mahsulot Nomi Bilan
            </button>
            <button
              type="button"
              className={`btn ${!isNewProductMode ? 'btn-primary' : 'btn-outline-secondary'} fs-8`}
              onClick={() => setIsNewProductMode(false)}
            >
              <LuListFilter className="me-1" /> Mavjud Mahsulot Ro'yxatidan
            </button>
          </div>
        </div>

        <div className="row g-3">
          {/* Mode 1: Custom Product Name Input */}
          {isNewProductMode ? (
            <div className="col-12 col-md-8">
              <Input
                label="Mahsulot / Xomashyo Nomi"
                placeholder="Masalan: Kotyol Nasosi 25kW, Truba 50mm, Gaskat..."
                value={formData.customProductName}
                onChange={(e) => setFormData({ ...formData, customProductName: e.target.value })}
                required
              />
            </div>
          ) : (
            /* Mode 2: Existing Product Select */
            <div className="col-12 col-md-8">
              <Select
                label="Mavjud Mahsulot Ro'yxati"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                options={productOptions}
              />
            </div>
          )}

          {/* Dynamic Warehouse Select */}
          <div className="col-12 col-md-4">
            <DynamicSelect
              label="Qaysi Omborga"
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              options={warehouseOptions}
              managePath={ROUTES.PROTECTED.SETTINGS_WAREHOUSE}
              onAddNew={handleAddNewWarehouse}
              entityTitle="Ombor"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <Input
              label="Kirim Miqdori"
              placeholder="Masalan: 100"
              type="number"
              min="0.01"
              step="any"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <Select
              label="O'lchov Birligi"
              value={formData.unitName}
              onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
              options={unitOptions}
            />
          </div>

          <div className="col-12 col-md-4">
            <Input
              label="Birlik Narxi ($) (Ixtiyoriy)"
              placeholder="0.00"
              type="number"
              step="any"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label fs-7 fw-medium text-main">Izoh / Hujjat Ma'lumoti (Ixtiyoriy)</label>
            <textarea
              className="form-control fs-7"
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Masalan: 1-partiya kirim shartnoma №402..."
            ></textarea>
          </div>
        </div>
      </form>
    </Modal>
  );
};
